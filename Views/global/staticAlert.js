const StaticAlert = {
    show(message, domElement) {
      if (this.exist()) {
        return;
      }
      const staticAlertElement = `
          <section class="static-alert p-3 mb-3 bg-danger text-white">
              <span class="fw-bold"> Error! </span>
              <span> ${message} </span>
          </section>
      `;
      domElement.innerHTML += staticAlertElement;
  
      setTimeout(() => {
        this.remove();
      }, 3000);
    },
  
    remove() {
      if (!this.exist()) {
        return;
      }
      this.get().remove();
    },
  
    exist() {
      return this.get() !== null;
    },
  
    get() {
      return document.querySelector(".static-alert");
    }
  }
  
  export default StaticAlert;