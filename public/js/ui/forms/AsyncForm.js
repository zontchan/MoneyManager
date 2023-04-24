/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if(!element){
      throw Error('Элемент не обнаружен');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Необходимо запретить отправку формы и в момент отправки
   * вызывает метод submit()
   * */
  registerEvents() {
    this.element.onsubmit = (e)=>{
      e.preventDefault();
      this.formData = new FormData(e.target);
      //this.element = new FormData(e.target); //я думала правильно вот так и все слетало, не срабатывал reset()
      this.submit();
    }

  }

  /**
   * Преобразует данные формы в объект вида
   * {
   *  'название поля формы 1': 'значение поля формы 1',
   *  'название поля формы 2': 'значение поля формы 2'
   * }
   * */
  getData() {
    let data = {};
    for(let item of this.formData.entries()){ //element написала вместо formdata
      const name = item[0];
      const value = item[1];
      data[name] = value;
    }
    return data;
  }

  onSubmit(options){

  }

  /**
   * Вызывает метод onSubmit и передаёт туда
   * данные, полученные из метода getData()
   * */
  submit() {
    this.onSubmit(this.getData(this.formData));    //было в конце this.formdata
  }
}