import './css/style.css'
import './css/style.less'
import jq from './js/jquery';
import { sum } from './utils/utils';

console.log('index');
console.log(sum(1, 3));
jq('nihao');
// let a = 'hello world!!!!';
// document.body.innerHTML = a;


// 热更新
if (module.hot) {
    module.hot.accept();
}