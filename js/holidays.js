if (typeof exports !== 'undefined') {
    var jscal = require('./jscal').jscal;
}

var holidays = {
    Chinese: {
        //1st day of 1st lunar month	Chinese New Year (Spring Festival)
        "Chinese_New_Year":function (year) {
            return jscal.chinese_new_year(year);
        },
        //15th day of 1st lunar month	Lantern Festival
        "Lantern_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 1, chinese.leap, 15)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 1, chinese.leap, 15)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 1, chinese.leap, 15)));
            return ret;
        },
        //2nd day of 2nd lunar month	Zhonghe Festival (Blue Dragon Festival)
        "Zhonghe_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 2, chinese.leap, 2)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 2, chinese.leap, 2)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 2, chinese.leap, 2)));
            return ret;
        },
        //3rd day of 3rd lunar month	Shangsi Festival
        "Shangsi_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 3, chinese.leap, 3)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 3, chinese.leap, 3)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 3, chinese.leap, 3)));
            return ret;
        },
        "Qing_Ming":function (year) {
            return jscal.qing_ming(year);
        },
        // 5th day of 5th lunar month	Duanwu Festival (Dragon Boat Festival)
        "Duanwu_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 5, chinese.leap, 5)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 5, chinese.leap, 5)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 5, chinese.leap, 5)));
            return ret;
        },
        //7th day of 7th lunar month	Qixi Festival (The Night of Sevens, Magpie Festival)
        "Qixi_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 7, chinese.leap, 7)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 7, chinese.leap, 7)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 7, chinese.leap, 7)));
            return ret;
        },
        //15th day of 7th lunar month	Ghost Festival
        "Ghost_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 7, chinese.leap, 15)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 7, chinese.leap, 15)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 7, chinese.leap, 15)));
            return ret;
        },
        //15th day of 8th lunar month	Mid-Autumn Festival (Moon Festival)
        "Moon_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 8, chinese.leap, 15)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 8, chinese.leap, 15)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 8, chinese.leap, 15)));
            return ret;
        },
        //9th day of 9th lunar month	Double Ninth Festival (Chongyang Festival)
        "Chongyang_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 9, chinese.leap, 9)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 9, chinese.leap, 9)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 9, chinese.leap, 9)));
            return ret;
        },
        //15th day of the 10th lunar month	Spirit Festival / Water Lantern Festival
        "Spirit_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 10, chinese.leap, 15)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 10, chinese.leap, 15)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 10, chinese.leap, 15)));
            return ret;
        },
        //8th day of 12th lunar month	Laba Festival
        "Laba_Festival":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var chinese = jscal.chinese_from_fixed(fixed);

            var ret = [];
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year, 0, chinese.leap, 8)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 1, 0, chinese.leap, 8)));
            ret.push(jscal.fixed_from_chinese(jscal.chinese_date(chinese.cycle, chinese.year + 2, 0, chinese.leap, 8)));
            return ret;
        }
    },
    Islamic: {
        //Muharram (1 Muharram)
        "Muharram":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var islamic = jscal.islamic_from_fixed(fixed);
            return jscal.fixed_from_islamic(jscal.islamic_date(islamic.year, 1, 1));
        },
        //Mawlid al-Nabi (12 Rabi 1)
        "Mawlid_an-Nabi":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var islamic = jscal.islamic_from_fixed(fixed);
            return jscal.fixed_from_islamic(jscal.islamic_date(islamic.year, 3, 12));
        },
        //Eid al-Fitr (1 Shawwal)
        "Eid_al-Fitr":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var islamic = jscal.islamic_from_fixed(fixed);
            return jscal.fixed_from_islamic(jscal.islamic_date(islamic.year, 10, 1));
        },
        //Eid al-Adha (10 Dhu'l-Hijjah)                    u
        "Eid_al-Ahda":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var islamic = jscal.islamic_from_fixed(fixed);
            return jscal.fixed_from_islamic(jscal.islamic_date(islamic.year, 12, 10));
        },
        "Ramadan":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var islamic = jscal.islamic_from_fixed(fixed);
            var fd_start = jscal.fixed_from_islamic(jscal.islamic_date(islamic.year, 9, 1));
            var fd_end = jscal.fixed_from_islamic(jscal.islamic_date(islamic.year, 10, 1)) - 1;

            var ret = [];
            for (var i = fd_start; i <= fd_end; i++) {
                ret.push(i);
            }
            return ret;
        }
    },
    Hebrew: {
        "Tu_Bishvat":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.SHEVAT, 15));
        },
        "Purim":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            if (jscal.is_hebrew_leap_year(hebrew.year)) {
                return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.ADARII, 14));
            }
            else {
                return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.ADAR, 14));
            }
        },
        "Pesach":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.NISAN, 15));
        },
        "Yom_HaShoah":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.NISAN, 27));
        },
        "Yom_Ha'atzmaut":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.IYYAR, 5));
        },
        "Lag_Ba'omer":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.IYYAR, 18));
        },
        "Shavuot":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.SIVAN, 6));
        },
        "Tisha_B'Av":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.AV, 9));
        },
        "Rosh_Hashanah":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            var fd_start = jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.TISHRI, 1));
            var fd_end = jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.TISHRI, 2));

            var ret = [];
            for (var i = fd_start; i <= fd_end; i++) {
                ret.push(i);
            }
            return ret;
        },
        "Yom_Kippur":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.TISHRI, 10));
        },
        "Sukkot":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            var fd_start = jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.TISHRI, 15));
            var fd_end = jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.TISHRI, 21));

            var ret = [];
            for (var i = fd_start; i <= fd_end; i++) {
                ret.push(i);
            }
            return ret;
        },
        "Shemini_Atzeret":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.TISHRI, 22));
        },
        "Simchat_Torah":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            return jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.TISHRI, 23));
        },
        "Hanukkah":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var hebrew = jscal.hebrew_from_fixed(fixed);
            var fd_start = jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.KISLEV, 25));
            var fd_end = jscal.fixed_from_hebrew(jscal.hebrew_date(hebrew.year, jscal.TEVET, 3));

            var ret = [];
            for (var i = fd_start; i <= fd_end; i++) {
                ret.push(i);
            }
            return ret;
        }

    },
    Hindu : {
        //Mahavir Jayanti
        "Mahavir_Jayanti":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var old_hindu = jscal.old_hindu_lunar_from_fixed(fixed);
            return jscal.fixed_from_old_hindu_lunar(jscal.old_hindu_lunar_date(old_hindu.year, 1, old_hindu.leap, 14));
        },
        "Makar_Sankranti":function (year) {
            return jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 14));
        },
        "Vasant_Panchami":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var old_hindu = jscal.old_hindu_lunar_from_fixed(fixed);
            return jscal.fixed_from_old_hindu_lunar(jscal.old_hindu_lunar_date(old_hindu.year, 11, old_hindu.leap, 5));
        },
        "Maha_Shivaratri":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var old_hindu = jscal.old_hindu_lunar_from_fixed(fixed);
            return jscal.fixed_from_old_hindu_lunar(jscal.old_hindu_lunar_date(old_hindu.year, 11, old_hindu.leap, 29));
        },
        //Full Moon, Month 12
        "Holi":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var old_hindu = jscal.old_hindu_lunar_from_fixed(fixed);
            return jscal.fixed_from_old_hindu_lunar(jscal.old_hindu_lunar_date(old_hindu.year, 12, old_hindu.leap, 16));
        },
        "Gudi_Padva":function (year) {
            var fixed = jscal.fixed_from_gregorian(jscal.gregorian_date(year, jscal.JANUARY, 1));
            var old_hindu = jscal.old_hindu_lunar_from_fixed(fixed);
            return jscal.fixed_from_old_hindu_lunar(jscal.old_hindu_lunar_date(old_hindu.year, 1, old_hindu.leap, 1));
        }
    },
    Roman: {
        "epiphany":function (year) {
            return jscal.epiphany(year);
        },
        "Groundhog_Day":function (year) {
            return jscal.fixed_from_gregorian(jscal.gregorian_date(year,jscal.FEBRUARY, 2));
        },
        "Valentines_Day":function (year) {
            return jscal.fixed_from_gregorian(jscal.gregorian_date(year,jscal.FEBRUARY, 14));
        },
        "St_Patricks_Day":function (year) {
            return jscal.fixed_from_gregorian(jscal.gregorian_date(year,jscal.MARCH, 17));
        },
        "Earth_Day":function (year) {
            return jscal.fixed_from_gregorian(jscal.gregorian_date(year,jscal.APRIL, 22));
        },
        "Cinco_de_Mayo":function (year) {
            return jscal.fixed_from_gregorian(jscal.gregorian_date(year,jscal.MAY, 5));
        },
        "Memorial_Day":function (year) {
            return jscal.memorial_day(year);
        },
        "Independence_Day":function (year) {
            return jscal.independence_day(year);
        },
        "Larbor_Day":function (year) {
            return jscal.labor_day(year);
        },
        "election_day":function (year) {
            return jscal.election_day(year);
        },
        "dst_start":function (year) {
            return jscal.daylight_saving_start(year);
        },
        "dst_end":function (year) {
            return jscal.daylight_saving_end(year);
        },
        "Christmas":function (year) {
            return jscal.christmas(year);
        },
        "Gregorian_New_Year":function (year) {
            return jscal.gregorian_new_year(year);
        },
        "Gregorian_New_Year_Eve":function (year){
            return jscal.gregorian_year_end(year);
        },
        "Easter":function (year) {
            return jscal.easter(year);
        }
    }
};

if (typeof exports !== 'undefined') {
    exports.holidays = holidays;
}