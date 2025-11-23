// utils/notify.js
// Simple wrapper around SweetAlert2 for consistent toast notifications
window.Notify = {
  // DEBUG: if true, will also output to console.debug
  DEBUG: false,
  toast(type = 'success', title = '', timer = 2000) {
    // type: 'success' | 'error' | 'warning' | 'info'
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: type,
      title: title,
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true
    });
    if (this.DEBUG) console.debug('[TOAST]', type, title);
  },
  success(title = '', timer = 2000) {
    this.toast('success', title, timer);
  },
  error(title = '', timer = 3000) {
    this.toast('error', title, timer);
  },
  warning(title = '', timer = 2500) {
    this.toast('warning', title, timer);
  },
  info(title = '', timer = 2000) {
    this.toast('info', title, timer);
  },
  // simple confirm wrapper
  async confirm(opts = {}) {
    const { title='確認', text='', icon='warning', confirmButtonText='確定', cancelButtonText='取消' } = opts;
    const res = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText
    });
    if (this.DEBUG) console.debug('[CONFIRM]', res);
    return res.isConfirmed;
  },
  // debug logger (respects DEBUG flag)
  log(...args) {
    if (this.DEBUG) console.debug(...args);
  }
};
