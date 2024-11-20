import moment from "moment";



export const getDateRange = (month, type = "month") => {
    const currentMoment = moment();

    // Calculate the start and end dates based on month value with new syntax
    const startMoment =
        month === 0
            ? currentMoment.startOf(type)
            : month > 0
            ? currentMoment.clone().add(month, type).startOf(type)
            : currentMoment
                  .clone()
                  .subtract(Math.abs(month), type)
                  .startOf(type);

    const endMoment =
        month === 0
            ? currentMoment.endOf(type)
            : month > 0
            ? currentMoment.clone().add(month, type).endOf(type)
            : currentMoment.clone().subtract(Math.abs(month), type).endOf(type);

    return {
        start_date: startMoment.format("DD/MM/YYYY"),
        end_date: endMoment.format("DD/MM/YYYY"),
    };
};

export const getLabelFromValue = (key, array) => {
    if (!key) return "";
    return array.find((item) => item.value === key).label;
};

export const convertToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const paddedHours = hours.toString().padStart(2, "0");

    const remainingMinutes = minutes % 60;
    const paddedMinutes = remainingMinutes.toString().padStart(2, "0");

    const hoursText =
        hours > 0 ? `${paddedHours} hr${hours > 1 ? "s" : ""}` : "";
    const minutesText =
        remainingMinutes > 0
            ? `${paddedMinutes} min${remainingMinutes > 1 ? "s" : ""}`
            : "";

    return `${hoursText} ${minutesText}`.trim();
};

export const generateRandomHexColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const generateRandomHexColorArray = (count) => {
    const colorArray = [];
    for (let i = 0; i < count; i++) {
        colorArray.push(generateRandomHexColor());
    }
    return colorArray;
};

export const getFullName = (firstName, lastName) => {
    let fullName = "";
    if (firstName) fullName += firstName;
    if (lastName) fullName += ` ${lastName}`;
    return fullName;
};

export const toNearest = (number, method = "ceil", nearest = 1000) => {
    if (method === "ceil") {
        return Math.ceil(number / nearest) * nearest;
    }
    return (Math.round(number / nearest) * nearest).toFixed(2);
};

export const parseFalsyValue = (value) => {
    if (value === undefined || value === "" || value === null) {
        return "-";
    } else {
        return value;
    }
};
