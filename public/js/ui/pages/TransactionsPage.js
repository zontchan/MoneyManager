/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  lastOptions = null;
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element){
      throw Error('Элемент не передан');
    }
    this.element = element;
    this.registerEvents();

  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    /*this.element.querySelector('.remove-account').addEventListener('click',(e)=>{
      e.preventDefault();
      this.removeAccount();
    })
    if(this.element.querySelector('.transaction__remove')) {
      this.element.querySelector('.transaction__remove').addEventListener('click', (e) => {
        e.preventDefault();
        this.removeTransaction(this.element.querySelector('.transaction__remove').dataset.id);
      })
    }*/


    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      const { target } = event;

      if (target.closest('.remove-account')) {
        if (document.querySelector('.content-title').textContent === 'Название счёта') return;
        this.removeAccount();
      }

      if (target.closest('.transaction__remove')) {
        this.removeTransaction(target.closest('.transaction__remove').dataset.id);
      }

    });

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions===null){
      return;
    }
    const confirm = window.confirm('Вы действительно хотите удалить данный счет?');
    if(confirm){
      const name = this.element.querySelector('.content-title').textContent;
      const { account_id } = this.lastOptions;
      Account.remove({ name: name, id: account_id }, response => {

        if (response.success) {
          App.updateWidgets();
        }

      })
      this.clear();
      App.update();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const confirm = window.confirm('Вы действительно хотите удалить данную транзакцию?');
    if(confirm){
      Transaction.remove({id: id}, response=>{
        if(response.success){
          //this.update();
          App.update();
        }
      })
    }

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(!options){
      return;
    }
    this.lastOptions = options;
    const {account_id:id} = options;
    Account.get(id,response=>{
      if(response.success){
        this.renderTitle(response.data.name);
        Transaction.list(response.data, response=>{
          if(response.success){
            this.renderTransactions(response.data);
          }
        })
      }
    })

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector('.content-title').textContent = name;

  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let data = new Date(date);

    let day = data.getDate();
    let month = data.toLocaleString('default', { month: 'long' });
    let year = data.getFullYear();
    let hour = data.getHours();
    let minutes = data.getMinutes();

    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${day} ${month} ${year} г. в ${hour}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const {account_id, created_at:time,id, name, sum, type, user_id } = item;
    return `<div class="transaction transaction_${type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(time)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          ${sum}<span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`;

  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    /*Array.from(data).forEach((item)=>{
      this.element.querySelector('.content').insertAdjacentHTML('afterbegin',this.getTransactionHTML(item));
    })*/





    if (data.length === 0 || !!this.element.querySelector('.transaction')) {

      for (let elem of this.element.querySelectorAll('.transaction')) {
        elem.remove();
      }

    }

    for (let item of Array.from(data)) {
      this.element.querySelector('.content').insertAdjacentHTML('beforeend', this.getTransactionHTML(item));
    }

  }


}