class ReleasesList extends HTMLElement {
  constructor() {
    super();

    const selectAllCheckboxId = this.getPrefixed('selectAllCheckbox');
    const template = document.createElement('template');
    template.innerHTML = `
        <table class="table table-hover table-sm table-transparent">
          <thead>
            <tr>
              <th><input type="checkbox" id="${selectAllCheckboxId}"></th>
              <th><label for="${selectAllCheckboxId}">Select All</label></th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        <div class="fixed-bottom buttons"></div>
    `;

    this.appendChild(template.content.cloneNode(true));

    const selectAllCheckbox = this.querySelector("#"+selectAllCheckboxId);
    selectAllCheckbox.addEventListener("change", () => {
      this.selectAllCheckboxes(selectAllCheckbox.checked);
    });

    const table = this.querySelector(".table");
    table.addEventListener("click", event => {
      const target = event.target;
      if (target.nodeName === 'TD') {
        const parentTr = target.parentElement;
        const checkbox = parentTr.querySelector("input[type='checkbox']");
        if (checkbox && !target.matches("label")) {
          this.selectCheckbox(checkbox, !checkbox.checked);
        }
      }
    });
    table.addEventListener('change', event => {
      const target = event.target;
      if (target.type === 'checkbox') {
        this.selectCheckbox(target, target.checked);
      }
    });
  }

  getPrefix() {
    return this.id;
  }

  getPrefixed(str) {
    return this.getPrefix() + '__' + str ?? '';
  }

  /**
   * @param {Element|Array<Element>} button
   */
  appendButton(...button) {
    const buttons = this.querySelector(".buttons");
    button.forEach(el => buttons.appendChild(el));
  }

  selectCheckbox(checkbox, checked) {
    if (checkbox.type !== 'checkbox') {
      return;
    }

    checkbox.checked = checked;

    if (checkbox.classList.contains('release-checkbox')) {
      const tr = checkbox.closest('tr');
      const className = 'selected';

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

  populateData(data) {
    const tableBody = this.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((item, index) => {
      const row = document.createElement("tr");
      const checkboxId = this.getPrefixed('checkbox_'+index);
      row.innerHTML = `
        <td><input type="checkbox" value="${item.value}" id="${checkboxId}" class="release-checkbox"></td>
        <td><label for="${checkboxId}">${item.title}</label></td>
      `;
      tableBody.appendChild(row);
    });
    return this;
  }

  selectAllCheckboxes(checked) {
    this.getCheckboxes().forEach(checkbox => {
      this.selectCheckbox(checkbox, checked);
    });
    return this;
  }

  getCheckboxes(onlyChecked = false) {
    return this.querySelectorAll("input.release-checkbox[type='checkbox']" + (onlyChecked ? ":checked" : ""));
  }

  getSelectedValues() {
    return Array.from(this.getCheckboxes(true)).map(checkbox => checkbox.value);
  }

  getSelectedTitles() {
    return Array.from(this.getCheckboxes(true)).map(checkbox => checkbox.nextElementSibling.textContent);
  }
}

customElements.define('releases-list', ReleasesList);
