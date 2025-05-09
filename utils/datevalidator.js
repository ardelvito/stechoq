function isValidDate(dateString) {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    const timestamp = date.getTime();

    if (isNaN(timestamp)) return false;

    return date.toISOString().slice(0, 10) === dateString;
}

module.exports = { isValidDate };
