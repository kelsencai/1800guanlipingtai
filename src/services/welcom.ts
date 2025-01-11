import { request } from '@umijs/max';

export async function getStatisticsViolationUnit() {
  return request('/violation/statisticsViolationUnit', {
    method: 'POST',
  });
}

export async function getRiskStatistics() {
  return request('/risk/statisticsRisk', {
    method: 'POST',
  });
}

export async function getInfoStatistics() {
  return request('/info/statisticsWelcome', {
    method: 'POST',
  });
}

export async function getMenuData() {
  return fetch('/menu.json', {
    method: 'GET',
  });
}
