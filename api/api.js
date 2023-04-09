//export const BASE_URL = 'https://www.myzycourse.top';
//export const BASE_URL = 'http://localhost:9015';
//export const myRequest = (url, method, data) => { //暴露一个function：myRequest，使用options接收页面传过来的参数
// console.log(data)
// 	if(method == 'put'){
// 		return new Promise((resolve, reject) => { //异步封装接口，使用Promise处理异步请求
// 			uni.request({ //发送请求
// 				url: BASE_URL + url, //接收请求的API
// 				method: method, //接收请求的方式,如果不传默认为GET
// 				data:data,
// 				header: {
// 					Authority: uni.getStorageSync('Authority'),
// 					'Content-Type':'application/x-www-form-urlencoded'
// 				},
// 				success: (res) => { //数据获取成功
// 					// if (res.data.meta.status !== 200) { //因为200是返回成功的状态码，如果不等于200,则代表获取失败,
// 					// 	return uni.showToast({
// 					// 		title: "数据获取失败！"
// 					// 	})
// 					// }	
// 					resolve(res) //成功,将数据返回
					
// 				},
// 				fail: (err) => { //失败操作
// 					uni.showToast({
// 						title: "请求接口失败！"
// 					})
// 					reject(err)
// 				}
// 			})
// 		})
// 	}else{
// 		return new Promise((resolve, reject) => { //异步封装接口，使用Promise处理异步请求
// 			uni.request({ //发送请求
// 				url: BASE_URL + url, //接收请求的API
// 				method: method, //接收请求的方式,如果不传默认为GET
// 				data: data, //接收请求的data,不传默认为空
// 				header: {
// 					Authority: uni.getStorageSync('Authority'),
// 				},
// 				success: (res) => { 
// 					resolve(res) //成功,将数据返回
// 				},
// 				fail: (err) => { //失败操作
// 					uni.showToast({
// 						title: "请求接口失败！"
// 					})
// 					reject(err)
// 				}
// 			})
// 		})
// 	}
// }