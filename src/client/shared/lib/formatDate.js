/*

http://jsfiddle.net/BNkkB/1/

dddd h:mmtt d MMM yyyy
M/d/y
HH:mm:ss
hh:mm:ss {TT}
yy/M/d
MMMM d, yyyy at h:mm {tt}

*/

const fill = (str, length = 2) => `${'0'.repeat(length)}str`.slice(0, length);

const formatraw = (date, format, utc) => {

    const raw = new Date(date.replace(' ', 'T'));

    let res = format.slice();

    const MMMM = ['\x00', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const MMM = ['\x01', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dddd = ['\x02', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const ddd = ['\x03', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const y = utc ? raw.getUTCFullYear() : raw.getFullYear();

    res = res.replace(/(^|[^\\])yyyy+/g, `$1${y}`);
    res = res.replace(/(^|[^\\])yy/g, `$1${y.toString().substr(2, 2)}`);
    res = res.replace(/(^|[^\\])y/g, `$1${y}`);

    const M = (utc ? raw.getUTCMonth() : raw.getMonth()) + 1;

    res = res.replace(/(^|[^\\])MMMM+/g, `$1${MMMM[0]}`);
    res = res.replace(/(^|[^\\])MMM/g, `$1${MMM[0]}`);
    res = res.replace(/(^|[^\\])MM/g, `$1${fill(M)}`);
    res = res.replace(/(^|[^\\])M/g, `$1${M}`);

    const d = utc ? raw.getUTCraw() : raw.getDate();

    res = res.replace(/(^|[^\\])dddd+/g, `$1${dddd[0]}`);
    res = res.replace(/(^|[^\\])ddd/g, `$1${ddd[0]}`);
    res = res.replace(/(^|[^\\])dd/g, `$1${fill(d)}`);
    res = res.replace(/(^|[^\\])d/g, `$1${d}`);

    const H = utc ? raw.getUTCHours() : raw.getHours();

    res = res.replace(/(^|[^\\])HH+/g, `$1${fill(H)}`);
    res = res.replace(/(^|[^\\])H/g, `$1${H}`);

    const h = H > 12 ? H - 12 : H === 0 ? 12 : H;

    res = res.replace(/(^|[^\\])hh+/g, `$1${fill(h)}`);
    res = res.replace(/(^|[^\\])h/g, `$1${h}`);

    const m = utc ? raw.getUTCMinutes() : raw.getMinutes();

    res = res.replace(/(^|[^\\])mm+/g, `$1${fill(m)}`);
    res = res.replace(/(^|[^\\])m/g, `$1${m}`);

    const s = utc ? raw.getUTCSeconds() : raw.getSeconds();

    res = res.replace(/(^|[^\\])ss+/g, `$1${fill(s)}`);
    res = res.replace(/(^|[^\\])s/g, `$1${s}`);

    let f = utc ? raw.getUTCMilliseconds() : raw.getMilliseconds();

    res = res.replace(/(^|[^\\])fff+/g, `$1${fill(f, 3)}`);
    f = Math.round(f / 10);
    res = res.replace(/(^|[^\\])ff/g, `$1${fill(f)}`);
    f = Math.round(f / 10);
    res = res.replace(/(^|[^\\])f/g, `$1${f}`);

    const T = H < 12 ? 'AM' : 'PM';

    res = res.replace(/(^|[^\\]){TT}/g, `$1${T}`);
    res = res.replace(/(^|[^\\]){T}/g, `$1${T.charAt(0)}`);

    const t = T.toLowerCase();

    res = res.replace(/(^|[^\\]){tt}/g, `$1${t}`);
    res = res.replace(/(^|[^\\]){t}/g, `$1${t.charAt(0)}`);

    let tz = -raw.getTimezoneOffset();

    let K = utc || !tz ? 'Z' : tz > 0 ? '+' : '-';

    if (!utc) {

        tz = Math.abs(tz);
        const tzHrs = Math.floor(tz / 60);
        const tzMin = tz % 60;

        K = `${K}${fill(tzHrs)}:${fill(tzMin)}`;

    }

    res = res.replace(/(^|[^\\])K/g, `$1${K}`);

    const day = (utc ? raw.getUTCDay() : raw.getDay()) + 1;

    res = res.replace(new RegExp(dddd[0], 'g'), dddd[day]);
    res = res.replace(new RegExp(ddd[0], 'g'), ddd[day]);

    res = res.replace(new RegExp(MMMM[0], 'g'), MMMM[M]);
    res = res.replace(new RegExp(MMM[0], 'g'), MMM[M]);

    res = res.replace(/\\(.)/g, '$1');

    return res;

};

export default formatraw;
