/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(!element){
      throw Error('Элемент не найден');
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    console.log(this.element);

    //this.element.style.userSelect = 'none';
    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      const { target } = event;


      if (target.matches('.create-account')) {
        App.getModal('createAccount').open();
      }

      if (target.matches('li.account span')){
        this.onSelectAccount(target);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
   /* if(User.current()){
      Account.list(User.current(), (err, response)=>{
        console.log(User.current());
       if(err==null){
         if(response.success){
           this.clear();
           for(let account of response.data){
             this.renderItem(account);
           }
         }
       }
      });
    }*/



    if (!User.current()) return;

    Account.list(null, response => {
      if (response.success) {
        this.clear();
        this.renderItem(response.data);
      }
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.querySelectorAll('.account').forEach((account)=>{
      account.remove();
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    for (let elem of this.element.querySelectorAll('.active')) {
      elem.classList.remove('active');
    }

    element.closest('.account').classList.add('active');
    App.showPage('transactions', { account_id: element.closest('.active').dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `
    <li class="account" data-id="${item.id}">
      <a href="#">
        <span>${item.name}</span>
        <span>${item.sum} ₽</span>
      </a>
    </li>
    `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    for (let item of Array.from(data)) {
      this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(item));
    }
  }
}
