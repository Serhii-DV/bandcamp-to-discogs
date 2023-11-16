import { getDataAttribute } from "../../modules/html";

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
          <div class="control-buttons btn-group btn-group-sm" role="group" aria-label="Control buttons">
          </div>
          <button id="${sortingId}-button" class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Sorting">Sorting</button>
          <ul id="${sortingId}" class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#" data-dir="asc" data-sorting-title="A..z">By name A..z</a></li>
            <li><a class="dropdown-item" href="#" data-dir="desc" data-sorting-title="z..A">By name z..A</a></li>
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

    const selectAllCheckbox = self.querySelector("#"+selectAllCheckboxId);
    selectAllCheckbox.addEventListener("change", () => {
      self.selectAllCheckboxes(selectAllCheckbox.checked);
    });

    const table = self.querySelector(".table");
    table.addEventListener("click", event => {
      const target = event.target;
      if (target.nodeName === 'TD') {
        const parentTr = target.parentElement;
        const checkbox = parentTr.querySelector("input[type='checkbox']");
        if (checkbox && !target.matches("label")) {
          checkbox.click();
        }
      }
    });
    table.addEventListener('change', event => {
      const target = event.target;
      if (target.type === 'checkbox') {
        self
          .selectCheckbox(target, target.checked)
          .refreshStatus();
      }
    });

    self.searchInput = document.getElementById(searchInputId);
    self.searchInput.addEventListener("input", filterTable);

    function filterTable() {
      const input = self.searchInput.value.toLowerCase();
      const rows = table.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const label = row.querySelector("td label").textContent.toLowerCase();
        row.classList[label.includes(input) ? 'remove' : 'add']('visually-hidden');
      });

      self.refreshStatus();
    }

    function setupSorting() {
      const sortingUl = self.querySelector('#' + sortingId);
      const sortingBtn = self.querySelector('#' + sortingId + '-button');
      const sortingOptions = sortingUl.querySelectorAll('.dropdown-item');

      sortingOptions.forEach((option) => {
        option.addEventListener('click', (e) => {
          const el = e.target;
          sortingBtn.innerText = getDataAttribute(el, 'sorting-title');
          sortTable(1, getDataAttribute(el, 'dir'));
        });
      });
    }

    const sortTable = (columnIndex, dir) => {
      const rows = Array.from(table.rows).slice(1); // Exclude the header row

      rows.sort((a, b) => {
          const x = a.cells[columnIndex].textContent.toLowerCase();
          const y = b.cells[columnIndex].textContent.toLowerCase();

          return dir === "asc" ? x.localeCompare(y) : y.localeCompare(x);
      });

      // Reorder the rows in the table
      rows.forEach((row) => table.tBodies[0].appendChild(row));
    };

    setupSorting();
  }

  refreshStatus() {
    const self = this;
    self
      .updateButtonsState()
      .refreshItemsStatus();
    return self;
  }

  refreshItemsStatus() {
    const self = this;
    const refreshStatusElement = (element) => {
      const total = self.querySelectorAll('tr.release-item').length;
      const selected = self.getSelectedValues().length;
      const filtered = self.querySelectorAll('tr.release-item:not(.visually-hidden)').length;
      const selectAllCheckboxId = self.getPrefixed('selectAllCheckbox');
      const statusText = element.getAttribute("data-format")
        .replace(new RegExp("{total}", "g"), total)
        .replace(new RegExp("{selected}", "g"), selected)
        .replace(new RegExp("{filtered}", "g"), filtered);
      element.textContent = statusText;
    };
    self.statusElements.forEach(refreshStatusElement);
    return self;
  }

  addStatusElement(...element) {
    const self = this;
    element.forEach(el => self.statusElements.push(el));
    return self;
  }

  getPrefix() {
    return this.id;
  }

  getPrefixed(str) {
    return this.getPrefix() + '__' + str ?? '';
  }

  /**
   * @param {Element|Array<Element>} button
   * @returns {ReleasesList}
   */
  appendButton(...button) {
    const controlButtons = this.querySelector(".control-buttons");
    button.forEach(el => controlButtons.appendChild(el));
    return this;
  }

  addStateButton(...button) {
    const self = this;
    button.forEach(btn => self.stateButtons.push(btn));
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

    if (checkbox.classList.contains('release-checkbox')) {
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
    const dataAttr = this.getAttribute("data");
    const data = dataAttr ? JSON.parse(dataAttr) : [];
    this.populateData(data);
  }

  /**
   * @param {Array} data
   * @returns {Self}
   */
  populateData(data) {
    const self = this;
    const tableBody = self.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((item, index) => {
      const row = document.createElement("tr");
      const checkboxId = self.getPrefixed('checkbox_'+index);
      row.classList.add('release-item');
      row.innerHTML = `
        <td><input type="checkbox" value="${item.value}" id="${checkboxId}" class="release-checkbox"></td>
        <td><label for="${checkboxId}">${item.title}</label></td>
      `;
      tableBody.appendChild(row);
    });

    self.refreshStatus();

    return self;
  }

  selectAllCheckboxes(checked) {
    const self = this;
    self.getCheckboxes().forEach(checkbox => {
      self.selectCheckbox(checkbox, checked);
    });
    return self;
  }

  getCheckboxes(onlyChecked = false) {
    return this.querySelectorAll(".release-item:not(.visually-hidden) input.release-checkbox[type='checkbox']" + (onlyChecked ? ":checked" : ""));
  }

  /**
   * @returns {Array}
   */
  getSelectedValues() {
    return Array.from(this.getCheckboxes(true)).map(checkbox => checkbox.value);
  }

  getSelectedTitles() {
    return Array.from(this.getCheckboxes(true)).map(checkbox => checkbox.nextElementSibling.textContent);
  }

  /**
   * @param {Element} button
   * @returns {ReleasesList}
  */
 updateButtonState(button) {
   const self = this;
   const checkboxes = self.getCheckboxes();
   const anyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
   button.disabled = !anyCheckboxChecked;
   return self;
  }

  updateButtonsState() {
    const self = this;
    self.querySelectorAll('[data-status-update]').forEach(button => self.updateButtonState(button));
    self.stateButtons.forEach(button => self.updateButtonState(button));
    return self;
  }
}

customElements.define('releases-list', ReleasesList);
