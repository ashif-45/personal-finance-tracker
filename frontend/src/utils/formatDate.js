import dayjs from 'dayjs';

export function formatDate(date, format = 'DD MMM YYYY') {
  if (!date) return '-';
  return dayjs(date).format(format);
}

export function formatRelativeDate(date) {
  if (!date) return '-';
  return dayjs(date).format('MMM DD, YYYY');
}