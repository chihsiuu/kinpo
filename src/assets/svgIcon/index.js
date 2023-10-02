//導入svgIcon/svg下的所有svg文件
const requireAll = requireContext => requireContext.keys().map(requireContext);
// const req = require.context("./svg", false, /\.svg$/); //not working
const req = require.context('!svg-sprite-loader?{"symbolId":"icon-[name]"}!./svg', false, /.svg$/);
/*
 第一个參數: './svg' => 需要檢索的目錄
 第二个參數: false => 是否檢索子目錄
 第三个參數: /\.svg$/ => 匹配文件的正則
*/
requireAll(req);