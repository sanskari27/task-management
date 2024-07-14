import DateUtils from './DateUtils';

export default class DateGenerator {
	private _frequency: 'daily' | 'weekly' | 'monthly';
	private _start_date: moment.Moment;
	private _end_date: moment.Moment;
	private _weekdays: (
		| 'monday'
		| 'tuesday'
		| 'wednesday'
		| 'thursday'
		| 'friday'
		| 'saturday'
		| 'sunday'
	)[];
	private _monthdays: number[];

	private _current: moment.Moment;

	constructor(details: {
		frequency: 'daily' | 'weekly' | 'monthly';
		start_date: Date;
		end_date: Date;
		weekdays: (
			| 'monday'
			| 'tuesday'
			| 'wednesday'
			| 'thursday'
			| 'friday'
			| 'saturday'
			| 'sunday'
		)[];
		monthdays: number[];
	}) {
		this._frequency = details.frequency;
		this._start_date = DateUtils.getMoment(details.start_date);
		this._end_date = DateUtils.getMoment(details.end_date);
		this._weekdays = details.weekdays;
		this._monthdays = details.monthdays;
		this._current = this._start_date.clone();
	}

	next() {
		if (this._current.isAfter(this._end_date)) {
			return undefined;
		}

		let nextDate = this._current.clone();
		if (this._frequency === 'daily') {
			nextDate = this._current.add(1, 'day');
		} else if (this._frequency === 'weekly') {
			let found = false;
			while (!found) {
				nextDate = this._current.add(1, 'day');
				if ((this._weekdays as string[]).includes(nextDate.format('dddd').toLowerCase())) {
					found = true;
				}
			}
		} else if (this._frequency === 'monthly') {
			let found = false;
			while (!found) {
				nextDate = this._current.add(1, 'day');
				if (this._monthdays.includes(nextDate.date())) {
					found = true;
				}
			}
		}

		this._current = nextDate;
		return nextDate.toDate();
	}

	hasNext() {
		return this._current.isBefore(this._end_date);
	}
}
