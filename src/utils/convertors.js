import moment from "jalali-moment";

export const twoDigit = (value) => {
  value = value.toString();
  if (value.length === 1) return "0" + value;
  else return value;
};

export const stringToPhoneNumber = (value) => {
  value = value.substr(1);
  value = e2p(value);
  return `+۹۸ ${value.substr(0, 3)} ${value.substr(3, 3)} ${value.substr(6, 4)}`;
}

export const e2p = (s, en) => {
  try {
    if (en) return s.toString();
    return s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  } catch (err) {
    return "";
  }
};
export const p2e = (s) => {
  try {
    return s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  } catch (err) {
    return "";
  }
};

export const miladiToPersian = (date) => {
  return moment(date, "YYYY-MM-DD").locale("fa").format("YYYY/MM/DD");
};

export const miladi2 = (date) => {
  date = new Date(date);
  date.setHours(date.getHours());
  date.setMinutes(date.getMinutes());
  const today = date.getDate() === new Date().getDate();
  if (today) return moment(date, "YYYY-MM-DD").locale("en").format("HH:mm");
  return moment(date, "YYYY-MM-DD").locale("en").format("YYYY/MM/DD");
};

export const miladiToPersian2 = (date) => {
  date = new Date(date);
  date.setHours(date.getHours());
  date.setMinutes(date.getMinutes());
  const today = date.getDate() === new Date().getDate();
  if (today) return moment(date, "YYYY-MM-DD").locale("fa").format("HH:mm");
  return moment(date, "YYYY-MM-DD").locale("fa").format("YYYY/MM/DD");
};

export const miladiToArabic2 = (date) => {
  date = new Date(date);
  date.setHours(date.getHours());
  date.setMinutes(date.getMinutes());
  const today = date.getDate() === new Date().getDate();
  if (today) return moment(date, "YYYY-MM-DD").locale("ar").format("HH:mm");
  return moment(date, "YYYY-MM-DD").locale("ar").format("YYYY/MM/DD");
};

export const miladiToPersianFull = (date) => {
  date = new Date(date);
  return e2p(moment(date).locale("fa").format("HH:mm - YYYY/MM/DD"));
}

export const miladiFull = (date) => {
  date = new Date(date);
  return moment(date).locale("en").format("HH:mm - YYYY/MM/DD");
}

export const miladiToArabicFull = (date) => {
  date = new Date(date);
  return e2p(moment(date).locale("ar").format("HH:mm - YYYY/MM/DD"));
}

export const persianToMiladi = (date) => {
  return moment.from(date, "fa", "YYYY-MM-DD").format("YYYY-MM-DD");
};

export const generateVoiceDuration = (value) => {
  const minutes = parseInt(value / 60);
  const seconds = value % 60; 
  return e2p(twoDigit(minutes) + ":" + twoDigit(seconds));
}

export const generateVoiceDurationMilli = (value) => {
  const seconds = parseInt(value / 1000);
  return generateVoiceDuration(seconds);
}

export const convertUriToPath = (uri) => {
  return uri.replace("file://", "");
}

export const generateFileSize = (bytes) => {
  if (bytes === 0) return '0 KB'; // If the file size is 0 bytes

  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  let size;
  let unit;

  if (bytes < megabyte) {
    size = bytes / kilobyte;
    unit = 'KB';
  } else if (bytes < gigabyte) {
    size = bytes / megabyte;
    unit = 'MB';
  } else {
    size = bytes / gigabyte;
    unit = 'GB';
  }

  return `${size.toFixed(2)} ${unit}`;
};
