export default{
  // 存储值
  // eslint-disable-next-line camelcase
  setItem (key, value, module_name) {
    // eslint-disable-next-line camelcase
    if (module_name) {
      let val = this.getItem(module_name)
      val[key] = value
      this.setItem(module_name, val)
    } else {
      let val = this.getStorage();
      val[key] = value;
      // eslint-disable-next-line no-undef
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    }
  },
  // 获取某一个模块下面的属性user下面的userName
  // eslint-disable-next-line camelcase
  getItem (key, module_name) {
    // eslint-disable-next-line camelcase
    if (module_name) {
      let val = this.getItem(module_name)
      if (val) return val[key]
    }
    return this.getStorage()[key]
  },
  getStorage () {
    // eslint-disable-next-line no-undef
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
  },
  // eslint-disable-next-line camelcase
  clear (key, module_name) {
    let val = this.getStorage()
    // eslint-disable-next-line camelcase
    if (module_name) {
      if (!val[module_name]) return
      delete val[module_name][key]
    } else {
      delete val[key]
    }
    // eslint-disable-next-line no-undef
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }
}
