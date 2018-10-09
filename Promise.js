const PROMISE_TIME_EXPIRED = Symbol("promise-time-expired");
const PROMISE_CANCELED = Symbol("promise-canceled");
const ppResolver = Symbol("ppResolver");
const ppRejecter = Symbol("ppRejecter");
const ppResolved = Symbol("ppResolved");
const ppRejected = Symbol("ppRejected");
const ppCanceled = Symbol("ppCanceled");
const ppTimeoutHandle = Symbol("ppTimeoutHandle");
const ppStopTimer = Symbol("ppStopTimer");

function stopTimer(promise){
	if(promise[ppTimeoutHandle]){
		clearTimeout(promise[ppTimeoutHandle]);
		promise[ppTimeoutHandle] = 0;
	}
}

export default class BdPromise extends Promise {
	constructor(
		timeout, // optional, time in milliseconds before promise is rejected; if missing, then never rejected because of time
		executor // standard promise constructor executor argument: function(resolve, reject)
	){
		if(typeof timeout==="function"){
			// signature is (executor)
			executor = timeout;
			timeout = false;
		}
		if(!executor){
			// signature is () or (timeout)
			executor = function(){
			};
		}

		let resolver = 0;
		let rejecter = 0;
		super(function(_resolver, _rejecter){
			resolver = _resolver;
			rejecter = _rejecter;
		});

		Object.defineProperties(this, {
			[ppTimeoutHandle]: {
				value: 0,
				writable: true
			},
			[ppResolver]: {
				value: resolver,
				writable: true
			},
			[ppRejecter]: {
				value: rejecter,
				writable: true
			},
			[ppResolved]: {
				value: false,
				writable: true
			},
			[ppRejected]: {
				value: false,
				writable: true
			},
			[ppCanceled]: {
				value: false,
				writable: true
			},
		});

		if(timeout){
			let self = this;
			this[ppTimeoutHandle] = setTimeout(function(){
				self[ppTimeoutHandle] = 0;
				self.cancel(PROMISE_TIME_EXPIRED)
			}, timeout);
		}

		executor(
			this.resolve.bind(this),
			this.reject.bind(this)
		);
	}

	cancel(cancelResult){
		if(!this[ppResolved] && !this[ppRejected] && !this[ppCanceled]){
			this[ppCanceled] = true;
			stopTimer(this);
			this[ppRejecter]((this.cancelResult = cancelResult === undefined ? PROMISE_CANCELED : cancelResult));
		}
		return this;
	}

	get resolved(){
		return this[ppResolved];
	}

	get rejected(){
		return this[ppRejected];
	}

	get canceled(){
		return this[ppCanceled];
	}

	resolve(result){
		if(!this[ppResolved] && !this[ppRejected] && !this[ppCanceled]){
			this[ppResolved] = true;
			this.result = result;
			stopTimer(this);
			this[ppResolver](result);
		}
		return this;
	};

	reject(error){
		if(!this[ppResolved] && !this[ppRejected] && !this[ppCanceled]){
			this[ppRejected] = true;
			this.error = error;
			stopTimer(this);
			this[ppRejecter](error);
		}
		return this;
	};
}

BdPromise.promiseTimeExpired = PROMISE_TIME_EXPIRED;
BdPromise.promiseCanceled = PROMISE_CANCELED;



