function getBrowserLanguage () {
  return navigator.language;
}
function getBrowserFirstLanguage () {
  return navigator.languages[0];
}
function getBrowserLanguageWithIntl () {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}
function getCurrentTimezone () {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const isChinaFn = () => {
  const browserLanguageWithIntl = getBrowserLanguageWithIntl();
  return getBrowserLanguage() === 'zh-CN' && getBrowserFirstLanguage() === 'zh-CN' && (browserLanguageWithIntl === 'zh-CN' || browserLanguageWithIntl === 'zh-Hans-CN') && getCurrentTimezone() === 'Asia/Shanghai' && new Date().getTimezoneOffset() === -480 && new Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Shanghai';
};

export const isChina = isChinaFn();
// alert(isChina());
// console.log(isChina(), getBrowserLanguage() === 'zh-CN', getBrowserFirstLanguage() === 'zh-CN', getBrowserLanguageWithIntl() === 'zh-CN', getCurrentTimezone() === 'Asia/Shanghai', new Date().getTimezoneOffset() === -480, new Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Shanghai');
