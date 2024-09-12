/*

Source: https://stackoverflow.com/questions/2613511/javascript-dateformat-for-different-timezones
Author: Steven Hoyt

*/

if (!Date.prototype.format) {
    Date.prototype.format = function(format) {
        if (isNaN(this.valueOf()) || !this.valueOf()) { return null; }
        

        const days        = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];
        const months      = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        const newDate     = new Date(this.getTime() + this.getTimezoneOffset() * 60000);
        const month       = newDate.getMonth();
        const weekDay     = newDate.getDay();
        const day         = newDate.getDate();
        const year        = newDate.getFullYear();
        const hour        = newDate.getHours();
        const minute      = newDate.getMinutes();
        const second      = newDate.getSeconds();
        const string      = [];
        const escapeNext  = false;
        for (const character of format) {
            if (escapeNext) {
                string.push(character);
                escapeNext = false;
            } else if (character === "\\") {
                escapeNext = true;
            } else {
                switch (character) {
                    case "a": string.push(hour < 12 ? "AM" : "PM");             break;
                    case "c": string.push(newDate.toISOString());               break;
                    case "d": string.push(String("0" + day).slice(-2));         break;
                    case "D": string.push(days[weekDay]);                       break;
                    case "F": string.push(months[month]);                       break;
                    case "g": let h = hour === 0 ? 12 : hour;                   
                              string.push(h > 12 ? h - 12 : h);                 
                              break;                                            
                    case "h": h = hour === 0 ? 12 : hour;                       
                              h = h > 12 ? h - 12 : h;                          
                              string.push(String("0" + h).slice(-2));           
                              break;                                            
                    case "H": string.push(String("0" + hour).slice(-2));        break;
                    case "i": string.push(String("0" + minute).slice(-2));      break;
                    case "j": string.push(day);                                 break;
                    case "l": string.push(days[weekDay]);                       break;
                    case "m": string.push(String("0" + (month + 1)).slice(-2)); break;
                    case "M": string.push(months[month].substring(0, 3));       break;
                    case "n": string.push(month + 1);                           break;
                    case "s": string.push(String("0" + second).slice(-2));      break;
                    case "w": string.push(weekDay);                             break;
                    case "y": string.push(year.toString().slice(-2));           break;
                    case "Y": string.push(year);                                break;
                    default : string.push(character);
                }
            }
        }
        return string.join("");
    };
}