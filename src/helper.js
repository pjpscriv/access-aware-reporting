/**
 * File to store all the universally used constants
 *
 * Author: Peter JP Scriven
 * Started: 6 Apr 2019
 * Updated: -
 */

// IMPORTS
const fs = require('fs');
const path = require('path');
const assert = require('assert');

/**
 * CONSTRUCTOR
 */
function Helper() {
  // Channel IDs
  this.ABUSE_CHANNEL = 5357;

  // MongoDB Constants
  this.URL = 'mongodb://localhost:27017';
  this.DBNAME = 'accessaware';
  this.COLNAME = 'abuse2oct';

  // Output directory
  this.OUTPUT_DIR = path.join(process.cwd(), '..', 'generated');

  // Map Marker File
  this.ICON_FILE = '../static/img/dot.png';

  // Months
  this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  this.monthsLong = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // Full Area Names
  this.names = {
    northern: 'Northern Region',
    midlands: 'Midlands Region',
    central: 'Central Region',
    southern: 'Southern Region',
    care_park1: 'Wellington Hospital',
    care_park2: 'Ewart Park',
    ccc: 'Christchurch City Council',
    wcc: 'Wellington City Council',
    huttcc: 'Lower Hutt City Council',
    tcc: 'Tauranga City Council',
    hutt_dhb: 'Hutt Hospital',
    pcc: 'Porirua City Council',
    dcc: 'Dunedin City Council',
    wdc: 'Waitaki District Council',
    pncc: 'Palmerston North City Council',
    npdc: 'New Plymouth District Council',
    rcc: 'Rotorua',
  };

  // CCS Regions
  this.regions = {
    northern: [
      [-37.62728430268013, 174.61669921875],
      [-37.26749576438184, 175.57662963867188],
      [-36.38370163392930, 175.133056640625],
      [-36.35273908735874, 176.209716796875],
      [-35.02099970111467, 175.1220703125],
      [-34.03445260967644, 173.045654296875],
      [-34.46127728843705, 171.837158203125],
      [-37.62728430268013, 174.61669921875],
    ],
    midlands: [
      [-38.700515838688716, 174.2926025390625],
      [-38.773357720269054, 174.88311767578125],
      [-38.47724452895558, 175.5999755859375],
      [-39.2705371709551, 175.5780029296875],
      [-39.12153746241925, 176.07513427734375],
      [-40.01709786313761, 176.16920471191406],
      [-40.362765146987606, 176.4575958251953],
      [-40.48873742102282, 177.044677734375],
      [-37.81412370160446, 179.36279296875],
      [-36.35273908735874, 176.209716796875],
      [-36.383701633929306, 175.133056640625],
      [-37.26749576438184, 175.57662963867188],
      [-37.62728430268013, 174.61669921875],
      [-38.700515838688716, 174.2926025390625],
    ],
    central: [
      [-40.47411375247882, 176.96777343749997],
      [-42.187829010590825, 175.73455810546875],
      [-41.47154438707646, 174.3695068359375],
      [-40.2585687639126, 174.8089599609375],
      [-39.317300373271024, 172.957763671875],
      [-38.700515838688716, 174.2926025390625],
      [-38.773357720269054, 174.88311767578125],
      [-38.47724452895558, 175.5999755859375],
      [-39.2705371709551, 175.5780029296875],
      [-39.12153746241925, 176.07513427734375],
      [-40.01709786313761, 176.16920471191406],
      [-40.47411375247882, 176.96777343749997],
    ],
    southern: [
      [-45.36758436884978, 172.70507812500003],
      [-42.67435857693384, 175.64666748046878],
      [-41.96357478222518, 174.33654785156256],
      [-40.75974059207393, 174.7210693359375],
      [-39.825413103424786, 172.86987304687506],
      [-43.88205730390538, 167.62939453125],
      [-46.55886030311717, 165.1904296875],
      [-48.03401915864285, 167.98095703125],
      [-45.36758436884978, 172.70507812500003],
    ],
  };

  // Providers
  this.providers = {
    care_park1: [ // 1.1 Wellington Hospital Shape
      [-41.30822, 174.77845],
      [-41.31074, 174.77916],
      [-41.31023, 174.78255],
      [-41.30849, 174.78129],
      [-41.30798, 174.77977],
      [-41.30822, 174.77845]],
    care_park2: [ // 1.2 Ewart Shape
      [-41.308196, 174.784927],
      [-41.308905, 174.785109],
      [-41.308631, 174.786590],
      [-41.307979, 174.786375],
      [-41.308196, 174.784927]],
    ccc: [ // 2. Christchurch Square (CCC)
      [-43.60, 172.50],
      [-43.60, 172.75],
      [-43.46, 172.75],
      [-43.46, 172.50],
      [-43.60, 172.50]],
    wcc: [ // 3. Wellington City Polygon (WCC)
      [-41.238447500055074, 174.86492156982422],
      [-41.20436026211487, 174.84106063842773],
      [-41.17413172186205, 174.78269577026367],
      [-41.16146775962086, 174.74321365356445],
      [-41.22618330551459, 174.61669921875],
      [-41.30876078219283, 174.59335327148438],
      [-41.37886950966322, 174.71420288085938],
      [-41.354133872100455, 174.83917236328125],
      [-41.28399850538593, 174.87625122070312],
      [-41.238447500055074, 174.86492156982422]],
    huttcc: [ // 4. Lower Hutt Polygon
      [-41.13761927094222, 174.97572898864743],
      [-41.201518856999684, 174.86629486083984],
      [-41.22192257321208, 174.8535919189453],
      [-41.242190848433374, 174.88380432128906],
      [-41.30876078219283, 174.87316131591797],
      [-41.315207748938164, 174.88483428955078],
      [-41.29044792023987, 174.9126434326172],
      [-41.29328546081614, 174.95349884033203],
      [-41.27677440393048, 174.9689483642578],
      [-41.234703937272215, 174.96517181396482],
      [-41.20009810817829, 174.99263763427734],
      [-41.164957054721015, 175.00697135925293],
      [-41.13761927094222, 174.97572898864743]],
    tcc: [ // 5. Tauranga Polygon
      [-37.61980636639724, 176.16182327270508],
      [-37.64808260456473, 176.16851806640625],
      [-37.65542179159457, 176.11066818237305],
      [-37.69251435532741, 176.09161376953125],
      [-37.75795850991873, 176.0785675048828],
      [-37.770986123710784, 176.10260009765625],
      [-37.74737188411865, 176.19461059570312],
      [-37.70826968435451, 176.23855590820312],
      [-37.74167076592309, 176.35391235351562],
      [-37.71288699102764, 176.36936187744138],
      [-37.61559119810623, 176.1764144897461],
      [-37.61980636639724, 176.16182327270508]],
    hutt_dhb: [ // 6. Hutt Hospital Polygon (DHB)
      [-41.203504624692755, 174.921977519989],
      [-41.2045701337362, 174.92000341415405],
      [-41.206152221219035, 174.92427349090576],
      [-41.20652352192289, 174.9257755279541],
      [-41.204473269994615, 174.92867231369016],
      [-41.20310101825193, 174.92820024490356],
      [-41.203504624692755, 174.921977519989]],
    pcc: [ // 7. Porirua Polygon (PCC)
      [-41.19648151746087, 174.84415054321286],
      [-41.15694432279551, 174.87436294555664],
      [-41.12553013964749, 174.91830825805664],
      [-41.09435964868544, 174.93890762329102],
      [-41.0765043232457, 174.89805221557614],
      [-41.02990237906034, 174.9126434326172],
      [-41.021743645024046, 174.88243103027344],
      [-41.043498022751244, 174.83041763305664],
      [-41.09539459123507, 174.81462478637695],
      [-41.17645748966958, 174.79917526245117],
      [-41.19648151746087, 174.84415054321286],
    ],
    dcc: [ // 8. Dunedin Polygon (DCC)
      [-45.91342185930157, 170.56858062744138],
      [-45.874951279880804, 170.55416107177734],
      [-45.861563961888706, 170.57209968566895],
      [-45.851521357466225, 170.5565643310547],
      [-45.837410825942186, 170.54265975952148],
      [-45.85080395917833, 170.45888900756836],
      [-45.86586738001098, 170.4470443725586],
      [-45.887976913156045, 170.41271209716794],
      [-45.91067484455802, 170.4056739807129],
      [-45.93706444982148, 170.41889190673828],
      [-45.92405033100668, 170.49631118774414],
      [-45.91342185930157, 170.56858062744138],
    ],
    wdc: [ // 9. Waitaki District Polygon (WDC)
      [-44.944753946044905, 171.15686416625977],
      [-44.92737682997145, 171.09128952026367],
      [-44.83347388333048, 170.6396484375],
      [-44.679395168267874, 170.4048156738281],
      [-44.58655513209543, 170.19882202148438],
      [-44.351350365612305, 170.20431518554688],
      [-44.27470475118813, 169.87060546875],
      [-44.24126379833977, 169.82254028320312],
      [-44.52980083067866, 169.76348876953125],
      [-44.621754096233246, 169.9214172363281],
      [-44.89479576469787, 170.32379150390625],
      [-45.08515722028692, 170.37322998046872],
      [-45.494796389669695, 170.244140625],
      [-45.58713413436409, 170.8648681640625],
      [-44.944753946044905, 171.15686416625977],
    ],
    pncc: [ // 10. Palmerston North Polygon (PNCC)
      [-40.34889902832031, 175.5450439453125],
      [-40.411143399500965, 175.59825897216797],
      [-40.35177713649866, 175.7160186767578],
      [-40.299166869333725, 175.66349029541016],
      [-40.34889902832031, 175.5450439453125],
    ],
    npdc: [ // 11. New Plymouth District Polygon (NPDC)
      [-39.063448587207205, 173.99974822998047],
      [-39.10155815684518, 174.05399322509766],
      [-39.08397168286112, 174.12677764892578],
      [-39.058650119748236, 174.1326141357422],
      [-39.03491957140722, 174.1889190673828],
      [-38.983164684048404, 174.1786193847656],
      [-39.063448587207205, 173.99974822998047],
    ],
    rcc: [ // 12. Rotorua (City Council?)
      [-38.18058470379002, 176.2443923950195],
      [-38.13408399698048, 176.32232666015625],
      [-38.11497569718241, 176.3022422790527],
      [-38.13428653167246, 176.27117156982422],
      [-38.09728086978861, 176.22962951660156],
      [-38.13955223637848, 176.18602752685547],
      [-38.18058470379002, 176.2443923950195],
    ]};

  // Other Areas
  this.areas = {
    northlands: [
      [-36.58465761247167, 173.82568359375],
      [-35.88905007936092, 175.0616455078125],
      [-33.82479361826488, 173.463134765625],
      [-34.56538299699511, 171.85363769531247],
      [-36.58465761247167, 173.82568359375],
    ],
  };

  // Names
  this.GMs = {
    northern: {full: 'Tina Syme', first: 'Tina'},
    midlands: {full: 'Colene Herbert', first: 'Colene'},
    central: {full: 'Janine Richards', first: 'Janine'},
    southern: {full: 'Melissa Smith', first: 'Melissa'},
  };
  this.MACs = {
    northern: {fulls: ['Vivian Naylor'], firsts: ['Vivian']},
    midlands: {fulls: ['Mandy Gudgeon', 'Maurice Flynn'],
      firsts: ['Mandy', 'Maurice']},
    central: {fulls: ['Raewyn'], firsts: ['Raewyn']},
    southern: {fulls: ['BJ Clark', 'Mary O\'Brien'], firsts: ['BJ', 'Mary']},
  };
}

// FUNCTIONS
// Key
Helper.prototype.getKey = function() {
  try {
    return fs.readFileSync('../api-key.txt').toString();
  } catch (err1) {
    try {
      return fs.readFileSync('./api-key.txt').toString();
    } catch (err2) {
      console.log(err1.message);
      console.log(err2.message);
      return;
    }
  }
};

// Date Stuff
Helper.prototype.dayRegEx = function(year, month, day) {
  const text = '^' + year + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (day < 10 ? '0' : '') + day;
  return new RegExp(text);
};

Helper.prototype.monthRegEx = function(year, month) {
  const text = '^' + year + '-' + (month < 10 ? '0' : '') + month;
  return new RegExp(text);
};

Helper.prototype.yearRegEx = function(year) {
  return new RegExp('^' + year + '-');
};

Helper.prototype.lastMonthRegEx = function(year, month) {
  assert.equal(true, (0 < month) && (month < 13));
  if (month === 1) {
    return this.monthRegEx(year-1, 12);
  } else {
    return this.monthRegEx(year, month-1);
  }
};

Helper.prototype.daysInMonth = function(year, month) {
  return new Date(year, month, 0).getDate();
};

// Directories
Helper.prototype.mkDirPath = function(dirPath) {
  if (!fs.existsSync(dirPath, fs.constants.R_OK | fs.constants.W_OK)) {
    try {
      fs.mkdirSync(dirPath);
    } catch (e) {
      this.mkDirPath(path.dirname(dirPath));
      this.mkDirPath(dirPath);
    }
  }
};

Helper.prototype.makeDir = function(year, month, parentDir) {
  // CCS Region or Provider Area
  const areaDir = path.join(this.OUTPUT_DIR, parentDir);

  const monthNum = (month<10 ? '0'+month : month);
  const monthStr = String(monthNum);
  // const monthStr = monthNum + ' - ' + this.months[month-1];
  const monthDir = path.join(areaDir, String(year), monthStr);

  // Make sub-directories
  const subDirs = ['csv', 'json', 'map', 'graph', 'html'];
  for (const dir of subDirs) {
    const subDir = path.join(monthDir, dir);
    this.mkDirPath(subDir);
  }

  return monthDir;
};

// Area Stuff
Helper.prototype.prettyAreaName = function(area) {
  // return area[0].toUpperCase() + area.slice(1);
  return this.names[area];
};

Helper.prototype.getPolygon = function(areaName) {
  const region = this.regions[areaName];
  const provider = this.providers[areaName];
  const area = this.areas[areaName];
  if (region !== undefined) {
    return region;
  } else if (provider !== undefined) {
    return provider;
  } else if (area !== undefined) {
    return area;
  } else {
    throw Error('Invalid area name. No corresponding polygon exists.');
  }
};


module.exports = Helper;
