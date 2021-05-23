import { addDays, endOfMonth, format, getDate, getDay, getDayOfYear, getDaysInMonth, getMonth, getYear, parseISO, startOfDay, toDate } from "date-fns";
import i18next from "i18next";
import { getTasks } from './tasksApi';

export const getBrackets = async (current, repeatableTasks) => {
    const dates = await calculateDates(current);
    return await calculateBrackets(dates, repeatableTasks);  
}

export const calculateDates = async (current) => {
    const { month, year } = current;
    let dates = [];
    const currentMonthDate = new Date(year, month, 1);
    const daysInCurrentMonth = getDaysInMonth(currentMonthDate);
    const firstDayOfMonth = getDay(currentMonthDate);
    const lastDayOfMonth = getDay(endOfMonth(currentMonthDate));
    if (firstDayOfMonth !== 0 ) {
        for(let i = firstDayOfMonth; i > 0; i--) {
            dates.push(addDays(currentMonthDate, -i));
        }
    };
    for (let i = 0; i < daysInCurrentMonth; i++) {
        dates.push(addDays(currentMonthDate, i));
    }
    let daysLeft = 42 - dates.length;
    for(let i = 1; i <= daysLeft; i++) {
        dates.push(addDays(endOfMonth(currentMonthDate), i));
    }
    return Promise.resolve(dates)
}

export const calculateBrackets = async (dates, repeatableTasks) => {
    let brackets = dates.map((d) => {
        const dParts = getDateParts(d);
        let bracket = { date: d, parts: dParts, data: [] };
        repeatableTasks.forEach(rt => {
            rt.schedule.forEach(rts => {
                const startDate = parseISO(rts.startDate);
                if (startOfDay(startDate) > startOfDay(d)) return;

                let rtsParts = getDateParts(startDate);
                if (rts.interval === 'day') {
                    bracket.data.push(rt);
                }
                if (rts.interval === 'week') {
                    if (dParts.weekDay == rtsParts.weekDay) {
                        bracket.data.push(rt);
                    }
                }
                if (rts.interval === 'month') {
                    if (dParts.day == rtsParts.day) {
                        bracket.data.push(rt);
                    }
                }
                if (rts.interval === 'year') {
                    if (dParts.yearDay == rtsParts.yearDay) {
                        bracket.data.push(rt);
                    }
                }
            })
        });
        return bracket;
    });
    return Promise.resolve(brackets);
}

export const getDateParts = (date) => {
    return {
        day: getDate(date),
        weekDay: getDay(date),
        month: getMonth(date),
        year: getYear(date),
        yearDay: getDayOfYear(date)
    }
}

export const getDateString = (date) => {
    date = toDate(new Date(date));
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    const monthName = format(date, 'LLLL').toLowerCase();
    
    return `${i18next.t('dates.day')} ${i18next.t(`dates.${dayOfWeek}`)}, ${format(date, 'd')} ${i18next.t(`dates.to`)}${i18next.t(`dates.${monthName}`)}, ${format(date, 'yyyy')}`
}