import moment from "moment/moment";
import {toBuddhistYear} from "./Buddhist-year";


const monthThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤษจิกายน", "ธันวาคม"]
const weekdays = 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_')
const monthThaiShort = 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_')
class MonthThai {

  monthThaiFull (number){
    return monthThai[number]
  }

  monthsThaiShort (number){
    return monthThaiShort[number]
  }

  dateTimeThaiFull(date){
    return date.format('DD') + " " + monthThai[(date).month()] + " " + toBuddhistYear(moment(date), 'YYYY')
  }

  dayThai(number){
    return weekdays[number]
  }
}

export default new MonthThai();

