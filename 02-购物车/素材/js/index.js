

// 1. 选择商品的数量


class Goods {
  constructor(good) {
    this.choose = 0
    this.good = good
  }

  get isChoose() {
    return this.choose > 0
  }

  get totalPrice() {
    return this.choose * this.good.price
  }

  increase() {
    this.choose ++
  }

  decrease() {
    if (this.choose === 0) return
    this.choose --
  }
}

class UIData {
  constructor() {
    this.deliveryThreshold = 30;
    this.deliveryPrice = 5;
    this.goods = goods.map(item => new Goods(item))
  }
  getTotalPrice() {
    return this.goods.reduce((prev,cur) => {
      return prev + cur.totalPrice
    }, 0)
  }

  increase(index) {
    this.goods[index].increase()
  }

  decrease(index) {
    this.goods[index].decrease()
  }

  totalCount() {
    return this.goods.reduce((prev, cur) => {
      return prev + cur.choose
    }, 0)
  }

  hasGoodsInCar() {
    return this.totalCount() > 0
  }

  // 是否跨过了起送标准
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() >= this.deliveryThreshold;
  }
  

  isChoose(index) {
    return this.goods[index].isChoose
  }
}

class UI {
  constructor() {
    this.uiData = new UIData()
    this.doms = {
      goodsContainer: document.querySelector('.goods-list'),
      deliveryPrice: document.querySelector('.footer-car-tip'),
      footerPay: document.querySelector('.footer-pay'),
      footerPayInnerSpan: document.querySelector('.footer-pay span'),
      totalPrice: document.querySelector('.footer-car-total'),
      car: document.querySelector('.footer-car'),
      badge: document.querySelector('.footer-car-badge'),
    }
    const carRect = this.doms.car.getBoundingClientRect()
    const jumpTarget = {
      x: carRect.left + carRect.width / 2,
      y: carRect.top + carRect.height / 5
    }
    this.jumpTarget = jumpTarget

    this.createHTML()
  }

  createHTML() {
    let html = ''
    console.log('---uiData', this.uiData.goods)
    this.uiData.goods.forEach((g, i) => {
      html += `<div class="goods-item">
        <img src="${g.good.pic}" alt="" class="goods-pic">
        <div class="goods-info">
          <h2 class="goods-title">${g.good.title}</h2>
          <p class="goods-desc">${g.good.desc}</p>
          <p class="goods-sell">
            <span>月售 ${g.good.sellNumber}</span>
            <span>好评率${g.good.favorRate}%</span>
          </p>
          <div class="goods-confirm">
            <p class="goods-price">
              <span class="goods-price-unit">￥</span>
              <span>${g.good.price}</span>
            </p>
            <div class="goods-btns">
              <i index="${i}" class="iconfont i-jianhao"></i>
              <span>${g.choose}</span>
              <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
            </div>
          </div>
        </div>
      </div>`
    })
    this.doms.goodsContainer.innerHTML = html
  }

  increase(index) {
    this.uiData.increase(index)
    this.updateGoodsItem(index);
    this.updateFooter();
    this.jump(index);
  }

  decrease(index) {
    this.uiData.decrease(index)
    this.updateGoodsItem(index);
    this.updateFooter();
  }

  updateGoodsItem(index) {
    const goodsDom = this.doms.goodsContainer.children[index];
    if (this.uiData.isChoose(index)) {
      goodsDom.classList.add('active')
    } else {
      goodsDom.classList.remove('active')
    }
    const span = goodsDom.querySelector('.goods-btns span');
    span.textContent = this.uiData.goods[index].choose
  }

  updateFooter() {
    const total = this.uiData.getTotalPrice()
    this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`
    if (this.uiData.isCrossDeliveryThreshold()){
      this.doms.footerPay.classList.add('active')
    } else {
      this.doms.footerPay.classList.remove('active')
      let dis = this.uiData.deliveryThreshold - total
      dis = Math.round(dis)
      this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`;
    }
    this.doms.totalPrice.textContent = total.toFixed(2);
    // 设置购物车的样式状态
    if (this.uiData.hasGoodsInCar()) {
      this.doms.car.classList.add('active');
    } else {
      this.doms.car.classList.remove('active');
    }
    // 设置购物车中的数量
    this.doms.badge.textContent = this.uiData.totalCount();
  }

  // 购物车动画
  carAnimate() {
    this.doms.car.classList.add('animate');
  }

  jump(index) {
    // 找到对应商品的加号
    var btnAdd = this.doms.goodsContainer.children[index].querySelector(
      '.i-jiajianzujianjiahao'
    );
    var rect = btnAdd.getBoundingClientRect();
    var start = {
      x: rect.left,
      y: rect.top,
    };
    // 跳吧
    var div = document.createElement('div');
    div.className = 'add-to-car';
    var i = document.createElement('i');
    i.className = 'iconfont i-jiajianzujianjiahao';
    // 设置初始位置
    div.style.transform = `translateX(${start.x}px)`;
    i.style.transform = `translateY(${start.y}px)`;
    div.appendChild(i);
    document.body.appendChild(div);
    // 强行渲染
    div.clientWidth;

    // 设置结束位置
    div.style.transform = `translateX(${this.jumpTarget.x}px)`;
    i.style.transform = `translateY(${this.jumpTarget.y}px)`;
    var that = this;
    div.addEventListener(
      'transitionend',
      function () {
        div.remove();
        that.carAnimate();
      },
      {
        once: true, // 事件仅触发一次
      }
    );
  }
}

const ui = new UI()

ui.doms.goodsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('i-jiajianzujianjiahao')) {
    var index = +e.target.getAttribute('index');
    ui.increase(index);
  } else if (e.target.classList.contains('i-jianhao')) {
    var index = +e.target.getAttribute('index');
    ui.decrease(index);
  }
});

window.addEventListener('keypress', function (e) {
  if (e.code === 'Equal') {
    ui.increase(0);
  } else if (e.code === 'Minus') {
    ui.decrease(0);
  }
});