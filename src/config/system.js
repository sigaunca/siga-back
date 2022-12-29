const config = require("config");

class SystemConfig {
  static first_date;
  static first_trimester_date;
  static second_trimester_date;
  static third_trimester_date;
  static year;
  constructor() {}

  static setConfig() {
    const now = new Date();
    this.year = now.getFullYear();
    this.first_date = new Date(
      `${this.year}-${config.get(
        "first_start_date_month"
      )}-${config.get("first_start_date_day")}`
    );
    this.first_trimester_date = new Date(
      `${this.year}-${config.get(
        "first_trimester_end_date_month"
      )}-${config.get("first_trimester_end_date_day")}`
    );
    this.second_trimester_date = new Date(
      `${this.year}-${config.get(
        "second_trimester_end_date_month"
      )}-${config.get("second_trimester_end_date_day")}`
    );
    this.third_trimester_date = new Date(
      `${this.year}-${config.get(
        "third_trimester_end_date_month"
      )}-${config.get("third_trimester_end_date_day")}`
    );

    console.log(
      "Fechas del sistema seteadas \nInicio de primer trimestre: %s \nInicio de segundo trimestre: %s\nInicio de tercer trimestre: %s\nFin de año lectivo: %s",
      this.first_date,
      this.first_trimester_date,
      this.second_trimester_date,
      this.third_trimester_date
    );
    return this;
  }

  static getConfig() {
    return {
      first_date: this.first_date,
      first_trimester_date: this.first_trimester_date,
      second_trimester_date: this.second_trimester_date,
      third_trimester_date: this.third_trimester_date,
    };
  }

  static getCurrentLimitDate({current_date}) {
    if (
      current_date >= this.first_date &&
      current_date < this.first_trimester_date
    ) {
      return {
        first_date_limit: this.first_date,
        second_date_limit: this.first_trimester_date
      }
    }
    if (
      current_date >= this.first_trimester_date &&
      current_date < this.second_trimester_date
    ) {
      return {
        first_date_limit: this.first_trimester_date,
        second_date_limit: this.second_trimester_date
      }
    } else {
      // TODO: considerar la fecha de inicio del año siguente, para tener en cuenta las calificaciones de febrero, que corresponden al año anterior
      return {
        first_date_limit: this.second_trimester_date,
        second_date_limit: this.third_trimester_date
      }
    }
  }
}

module.exports = { SystemConfig };
