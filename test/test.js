import Promise2 from "../promise.js"

const smoke = window.smoke;
const assert = smoke.assert;
smoke.defTest({
	id: "test Promise2",
	tests: [
		["resolve", function(){
			// test that a Promise2 resolves correctly asynchronously, no timer
			return new Promise(function(resolve, reject){
				let order = "";
				let p = new Promise2(function(resolve, reject){
					setTimeout(function(){
						order += "2";
						resolve("OK");
					}, 50);
				});
				order += "1";
				p.then(function(result){
					assert(result == "OK", "promised returned resolved value");
					assert(order == "12", "promised resolved asynchronously");
					resolve();
				}).catch(function(error){
					assert(false, "resolved promise should not go down error path");
					reject();
				});
			});
		}],

		["resolveSynch", function(){
			// test that a Promise2 resolves asynchronously with synchronous resolution, no timer
			return new Promise(function(resolve, reject){
				var order = "";
				var p = new Promise2(function(resolve, reject){
					order += "2";
					resolve("OK");
				});
				order += "1";
				p.then(function(result){
					console.warn("WARNING: promise test is proving wrong execution order for synchronous resolutions because engines are broke");
					assert(result == "OK", "promised returned resolved value");
					assert(order == "21", "promised resolved synchronously (improper)");
					resolve();
				}).catch(function(error){
					assert(false, "resolved promise should not go down error path");
					resolve();
				});
			});
		}],

		["reject", function(){
			// test that a Promise2 rejects correctly asynchronously, no timer
			return new Promise(function(resolve, reject){
				var order = "";
				var p = new Promise2(function(resolve, reject){
					setTimeout(function(){
						order += "2";
						reject("NAK");
					}, 50);
				});
				order += "1";
				p.then(function(result){
					assert(false, "promised was resolved unexpectedly");
					resolve();
				}).catch(function(error){
					assert(error == "NAK", "promised returned rejected value");
					assert(order == "12", "promised resolved asynchronously");
					resolve();

				});
			});
		}],

		["rejectSynch", function(){
			// test that a Promise2 rejects asynchronously with synchronous resolution, no timer
			return new Promise(function(resolve, reject){
				var order = "";
				var p = new Promise2(function(resolve, reject){
					order += "2";
					reject("NAK");
				});
				order += "1";
				p.then(function(result){
					assert(false, "promised was resolved unexpectedly");
					resolve();

				}).catch(function(error){
					console.warn("WARNING: promise test is proving wrong execution order for synchronous resolutions because engines are broke");
					assert(error == "NAK", "promised returned rejected value");
					assert(order == "21", "promised resolved synchronously (improper)");
					resolve();
				});
			});
		}],

		["cancel", function(){
			// test that a Promise2 cancels correctly asynchronously, no timer
			return new Promise(function(resolve, reject){
				var p = new Promise2(function(resolve, reject){
					setTimeout(function(){
						resolve("OK");
					}, 75);
				});

				setTimeout(function(){
					p.cancel();
				}, 25);

				p.then(function(result){
					try{
						assert(false, "promised was resolved unexpectedly");
						resolve();
					}catch(e){
						reject();
					}
				}).catch(function(error){
					try{
						assert(error === Promise2.promiseCanceled);
						resolve();
					}catch(e){
						reject();
					}
				});
			});
		}],


		["cancelWithMessage", function(){
			// test that a Promise2 cancels correctly asynchronously, with a message, no timer
			return new Promise(function(resolve, reject){
				var p = new Promise2(function(resolve, reject){
					setTimeout(function(){
						resolve("OK");
					}, 75);
				});

				var symbolTypeForCancel = Symbol();

				setTimeout(function(){
					p.cancel("here's a reason for you");
				}, 25);

				p.then(function(result){
					assert(false, "promised was resolved unexpectedly");
					resolve();
				}).catch(function(error){
					assert(error === "here's a reason for you");
					resolve();
				});
			});
		}],

		["lateCancel", function(){
			// test that a Promise2 doesn't cancel when the cancel is late, no timer
			return new Promise(function(resolve, reject){
				var p = new Promise2(function(resolve, reject){
					setTimeout(function(){
						resolve("OK");
					}, 25);
				});

				setTimeout(function(){
					p.cancel();
				}, 75);

				p.then(function(result){
					assert(result == "OK", "promised returned resolved value");
					resolve();
				}).catch(function(error){
					assert(false, "resolved promise should not go down error path");
					resolve();
				});
			});
		}],

		["resolveWithinTimeout", function(){
			// test that a Promise2 resolves correctly asynchronously, with a timer
			return new Promise(function(resolve, reject){
				var p = new Promise2(75, function(resolve, reject){
					setTimeout(function(){
						resolve("OK");
					}, 50);
				});
				p.then(function(result){
					assert(result == "OK", "promised returned resolved value");
					resolve();
				}).catch(function(error){
					assert(false, "resolved promise should not go down error path");
					resolve();
				});
			});
		}],

		["TimeoutBeforeResolve", function(){
			// test that a Promise2 rejects correctly asynchronously, with a timer that times out
			return new Promise(function(resolve, reject){
				var p = new Promise2(50, function(resolve, reject){
					setTimeout(function(){
						resolve("OK");
					}, 75);
				});
				p.then(function(result){
					assert(false, "promise should timeout.");
					resolve();
				}).catch(function(error){
					assert(error===Promise2.promiseTimeExpired);
					resolve();
				});
			});
		}]
	]
});
