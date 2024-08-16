import { getDataAttribute, input, setDataAttribute } from '../../utils/html';
import { hasClass, isEmptyArray } from '../../utils/utils';

class ReleasesList extends HTMLElement {
  constructor() {
    super();

    const self = this;
    self.stateButtons = [];
    self.statusElements = [];

    const selectAllCheckboxId = self.getPrefixed('selectAllCheckbox');
    const searchInputId = self.getPrefixed('searchInput');
    const sortingId = self.getPrefixed('sorting');
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="content-header input-group input-group-sm sticky-top">
          <input type="text" id="${searchInputId}" class="form-control form-control-sm" placeholder="Search...">
          <button id="clear-search-button" type="button" class="btn" title="Clear search">
            <b2d-icon name="x-circle"></b2d-icon>
          </button>
          <div class="control-buttons btn-group btn-group-sm" role="group" aria-label="Control buttons">
          </div>
          <button id="${sortingId}-button" class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Sorted by default">
            <b2d-icon name="sort-down"></b2d-icon>
          </button>
          <ul id="${sortingId}" class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#" data-attr="data-sort" data-comp-type="int" data-dir="asc" data-icon="sort-down" data-title="Sorted by default"><b2d-icon name="sort-down"></b2d-icon> reset</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" data-attr="data-title" data-dir="asc" data-icon="sort-alpha-down" data-title="Sorted by name A..z"><b2d-icon name="sort-alpha-down"></b2d-icon> by name A..z</a></li>
            <li><a class="dropdown-item" href="#" data-attr="data-title" data-dir="desc" data-icon="sort-alpha-down-alt" data-title="Sorted by name z..A"><b2d-icon name="sort-alpha-down-alt"></b2d-icon> by name z..A</a></li>
          </ul>
        </div>
        <table class="table table-hover table-sm table-transparent table-borderless">
          <thead>
            <tr>
              <th><input type="checkbox" id="${selectAllCheckboxId}" title="Select all"></th>
              <th>
                <label for="${selectAllCheckboxId}">
                  <span id="${selectAllCheckboxId}-info" class="selected-info">Releases</span>
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
    `;

    self.appendChild(template.content.cloneNode(true));

    const selectAllCheckbox = self.querySelector('#' + selectAllCheckboxId);
    selectAllCheckbox.addEventListener('change', () => {
      self.selectAllCheckboxes(selectAllCheckbox.checked);
    });

    const table = self.querySelector('.table');
    table.addEventListener('change', (event) => {
      const target = event.target;
      if (target.type === 'checkbox') {
        self.selectCheckbox(target, target.checked).refreshStatus();
      }
    });

    self.searchInput = document.getElementById(searchInputId);
    self.searchInput.addEventListener('input', filterTable);

    function filterTable() {
      const input = self.searchInput.value.toLowerCase();
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach((row) => {
        const label = row.querySelector('td label').textContent.toLowerCase();
        row.classList[label.includes(input) ? 'remove' : 'add'](
          'visually-hidden'
        );
      });

      self.refreshStatus();
    }

    function setupSorting() {
      const sortingUl = self.querySelector('#' + sortingId);
      const sortingBtn = self.querySelector('#' + sortingId + '-button');
      const sortingItems = sortingUl.querySelectorAll('.dropdown-item');

      function setupSortingButton(sortingItem) {
        const attr = getDataAttribute(sortingItem, 'attr');
        const compType = getDataAttribute(sortingItem, 'comp-type', 'string');
        const dir = getDataAttribute(sortingItem, 'dir', 'asc');
        const icon = getDataAttribute(sortingItem, 'icon');
        const title = getDataAttribute(sortingItem, 'title');

        sortingBtn.innerHTML = `<b2d-icon name="${icon}"></b2d-icon>`;
        sortingBtn.setAttribute('title', title);
        sortTable(attr, dir, compType);
      }

      sortingItems.forEach((option) => {
        option.addEventListener('click', (e) => {
          setupSortingButton(e.target);
        });
      });
    }

    const sortTable = (attr, dir = 'asc', compType = 'string') => {
      const rows = Array.from(table.rows).slice(1); // Exclude the header row
      const isComparingInt = compType === 'int';

      rows.sort((a, b) => {
        let x = a.getAttribute(attr);
        let y = b.getAttribute(attr);

        if (isComparingInt) {
          x = parseInt(x);
          y = parseInt(y);

          return dir === 'asc' ? x - y : y - x;
        }

        return dir === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
      });

      // Reorder the rows in the table
      rows.forEach((row) => table.tBodies[0].appendChild(row));
    };

    setupSorting();

    // Setup clear search button
    const clearSearchBtn = self.querySelector('#clear-search-button');
    clearSearchBtn.addEventListener('click', () => {
      self.setSearchValue('').refreshSearchStatus();
      self.searchInput.focus();
    });
  }

  refreshStatus() {
    const self = this;
    self.updateButtonsState().refreshItemsStatus();
    return self;
  }

  refreshItemsStatus() {
    const self = this;
    const refreshStatusElement = (element) => {
      const total = self.querySelectorAll('tr.release-item').length;
      const selected = self.getSelectedValues().length;
      const filtered = self.querySelectorAll(
        'tr.release-item:not(.visually-hidden)'
      ).length;
      const statusText = element
        .getAttribute('data-format')
        .replace(new RegExp('{total}', 'g'), total)
        .replace(new RegExp('{selected}', 'g'), selected)
        .replace(new RegExp('{filtered}', 'g'), filtered);
      element.textContent = statusText;
    };
    self.statusElements.forEach(refreshStatusElement);
    return self;
  }

  refreshSearchStatus() {
    const self = this;
    input(self.searchInput);
    return self;
  }

  addStatusElement(...element) {
    const self = this;
    element.forEach((el) => self.statusElements.push(el));
    return self;
  }

  getPrefix() {
    return this.id;
  }

  getPrefixed(str) {
    return this.getPrefix() + '__' + (str ?? '');
  }

  /**
   * @param {Element|Array<Element>} button
   * @returns {ReleasesList}
   */
  appendButton(...button) {
    const controlButtons = this.querySelector('.control-buttons');
    button.forEach((el) => controlButtons.appendChild(el));
    return this;
  }

  addStateButton(...button) {
    const self = this;
    button.forEach((btn) => self.stateButtons.push(btn));
    return self;
  }

  /**
   * @param {Element} checkbox
   * @param {Boolean} checked
   * @returns {ReleasesList}
   */
  selectCheckbox(checkbox, checked) {
    if (checkbox.type !== 'checkbox') {
      return this;
    }

    checkbox.checked = checked;

    if (hasClass(checkbox, 'release-checkbox')) {
      const tr = checkbox.closest('tr');
      const className = 'table-active';

      if (checkbox.checked) {
        tr.classList.add(className);
      } else {
        tr.classList.remove(className);
      }
    }
    return this;
  }

  connectedCallback() {
    const dataAttr = this.getAttribute('data');
    const data = dataAttr ? JSON.parse(dataAttr) : [];

    if (!isEmptyArray(data)) {
      this.populateData(data);
    }
  }

  /**
   * @param {Array} data
   * @returns {Self}
   */
  populateData(data) {
    const self = this;
    const tableBody = self.querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing data

    data.forEach((item, index) => {
      const row = document.createElement('tr');
      const checkboxId = self.getPrefixed('checkbox_' + index);
      row.classList.add('release-item');
      setDataAttribute(row, 'sort', index);
      setDataAttribute(row, item.dataAtts);
      row.innerHTML = `
        <td><input type="checkbox" value="${item.value}" id="${checkboxId}" class="release-checkbox"></td>
        <td><label for="${checkboxId}">${item.title}</label><span class="controls"></span></td>
      `;

      const controlsEl = row.querySelector('span.controls');
      item.controls.forEach((control) => {
        if (control instanceof HTMLElement) {
          controlsEl.appendChild(control);
        }
      });

      tableBody.appendChild(row);
    });

    self.refreshStatus().refreshSearchStatus();

    return self;
  }

  selectAllCheckboxes(checked) {
    const self = this;
    self.getCheckboxes().forEach((checkbox) => {
      self.selectCheckbox(checkbox, checked);
    });
    return self;
  }

  getCheckboxes(onlyChecked = false) {
    return this.querySelectorAll(
      ".release-item:not(.visually-hidden) input.release-checkbox[type='checkbox']" +
        (onlyChecked ? ':checked' : '')
    );
  }

  /**
   * @returns {Array}
   */
  getSelectedValues() {
    return Array.from(this.getCheckboxes(true)).map(
      (checkbox) => checkbox.value
    );
  }

  getSelectedTitles() {
    return Array.from(this.getCheckboxes(true)).map(
      (checkbox) => checkbox.nextElementSibling.textContent
    );
  }

  /**
   * @param {Element} button
   * @returns {ReleasesList}
   */
  updateButtonState(button) {
    const self = this;
    const checkboxes = self.getCheckboxes();
    const anyCheckboxChecked = Array.from(checkboxes).some(
      (checkbox) => checkbox.checked
    );
    button.disabled = !anyCheckboxChecked;
    return self;
  }

  updateButtonsState() {
    const self = this;
    self
      .querySelectorAll('[data-status-update]')
      .forEach((button) => self.updateButtonState(button));
    self.stateButtons.forEach((button) => self.updateButtonState(button));
    return self;
  }

  setSearchValue(value) {
    const self = this;
    self.searchInput.value = value;
    return self;
  }
}

if (!customElements.get('releases-list')) {
  customElements.define('releases-list', ReleasesList);
}
