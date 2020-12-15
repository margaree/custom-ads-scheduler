/*
	Logic for UTC -> Local DateTime conversion goes here
	We are assuming the LMS will give us a UTC DateTime string in the ISO 8601 format (ex: 1994-11-05T13:15:30Z)
	Returns a Javascript Date object
*/
export function getLocalDateTimeFromUTCDateTimeString(utcDateTimeStr) {
	if (utcDateTimeStr === undefined || utcDateTimeStr === null)
		return utcDateTimeStr;

	const utcDateTimeStrSplit = utcDateTimeStr.match(/\d+/g);

	const localDateObj = new Date(
		+utcDateTimeStrSplit[0],
		+utcDateTimeStrSplit[1] - 1,
		+utcDateTimeStrSplit[2],
		+utcDateTimeStrSplit[3],
		+utcDateTimeStrSplit[4],
		+utcDateTimeStrSplit[5]);

	return localDateObj;
}

/*
	Logic for Local DateTime -> UTC conversion goes here
	We are assuming that our frontend code will manipulate Javascript Date objects
	Returns a UTC DateTime string, in the ISO 8601 format (ex: 1994-11-05T13:15:30Z)
*/
export function getUTCDateTimeStringFromLocalDateTime(localDateObj) {
	if (localDateObj === undefined || localDateObj === null)
		return localDateObj;

	const utcDateTimeStr = localDateObj.toISOString();
	return utcDateTimeStr;
}
