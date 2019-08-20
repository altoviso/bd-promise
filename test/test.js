import BdPromise from '../Promise.js';

const smoke = window.smoke;
const assert = smoke.assert;
smoke.defTest({
    id: 'test bd-promise',
    tests: [
        ['resolve', () => {
            // test that a bd-promise resolves correctly asynchronously, no timer
            return new Promise(((resolve, reject) => {
                let order = '';
                const p = new BdPromise((resolve => {
                    setTimeout(() => {
                        order += '2';
                        resolve('OK');
                    }, 50);
                }));
                order += '1';
                p.then(result => {
                    assert(result === 'OK', 'promised returned resolved value');
                    assert(order === '12', 'promised resolved asynchronously');
                    resolve();
                }).catch(error => {
                    assert(false, 'resolved promise should not go down error path');
                    console.log(error);
                    reject();
                });
            }));
        }],

        ['resolveSynch', () => {
            // test that a bd-promise resolves asynchronously with synchronous resolution, no timer
            return new Promise((resolve => {
                let order = '';
                const p = new BdPromise((resolve => {
                    order += '2';
                    resolve('OK');
                }));
                order += '1';
                p.then(result => {
                    console.warn('WARNING: promise test is proving wrong execution order for synchronous resolutions because engines are broke');
                    assert(result === 'OK', 'promised returned resolved value');
                    assert(order === '21', 'promised resolved synchronously (improper)');
                    resolve();
                }).catch(error => {
                    assert(false, 'resolved promise should not go down error path');
                    console.log(error);
                    resolve();
                });
            }));
        }],

        ['reject', () => {
            // test that a bd-promise rejects correctly asynchronously, no timer
            return new Promise((resolve => {
                let order = '';
                const p = new BdPromise(((resolve, reject) => {
                    setTimeout(() => {
                        order += '2';
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject('NAK');
                    }, 50);
                }));
                order += '1';
                p.then(result => {
                    assert(false, 'promised was resolved unexpectedly');
                    console.log(result);
                    resolve();
                }).catch(error => {
                    assert(error === 'NAK', 'promised returned rejected value');
                    assert(order === '12', 'promised resolved asynchronously');
                    resolve();
                });
            }));
        }],

        ['rejectSynch', () => {
            // test that a bd-promise rejects asynchronously with synchronous resolution, no timer
            return new Promise((resolve => {
                let order = '';
                const p = new BdPromise(((resolve, reject) => {
                    order += '2';
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject('NAK');
                }));
                order += '1';
                p.then(result => {
                    assert(false, 'promised was resolved unexpectedly');
                    console.log(result);
                    resolve();
                }).catch(error => {
                    console.warn('WARNING: promise test is proving wrong execution order for synchronous resolutions because engines are broke');
                    assert(error === 'NAK', 'promised returned rejected value');
                    assert(order === '21', 'promised resolved synchronously (improper)');
                    resolve();
                });
            }));
        }],

        ['cancel', () => {
            // test that a bd-promise cancels correctly asynchronously, no timer
            return new Promise(((resolve, reject) => {
                const p = new BdPromise((resolve => {
                    setTimeout(() => {
                        resolve('OK');
                    }, 75);
                }));

                setTimeout(() => {
                    p.cancel();
                }, 25);

                p.then(result => {
                    try {
                        assert(false, 'promised was resolved unexpectedly');
                        console.log(result);
                        resolve();
                    } catch (e) {
                        reject();
                    }
                }).catch(error => {
                    try {
                        assert(error === BdPromise.promiseCanceled);
                        resolve();
                    } catch (e) {
                        reject();
                    }
                });
            }));
        }],


        ['cancelWithMessage', () => {
            // test that a bd-promise cancels correctly asynchronously, with a message, no timer
            return new Promise((resolve => {
                const p = new BdPromise((resolve => {
                    setTimeout(() => {
                        resolve('OK');
                    }, 75);
                }));

                setTimeout(() => {
                    p.cancel("here's a reason for you");
                }, 25);

                p.then(result => {
                    assert(false, 'promised was resolved unexpectedly');
                    console.log(result);
                    resolve();
                }).catch(error => {
                    assert(error === "here's a reason for you");
                    resolve();
                });
            }));
        }],

        ['lateCancel', () => {
            // test that a bd-promise doesn't cancel when the cancel is late, no timer
            return new Promise((resolve => {
                const p = new BdPromise((resolve => {
                    setTimeout(() => {
                        resolve('OK');
                    }, 25);
                }));

                setTimeout(() => {
                    p.cancel();
                }, 75);

                p.then(result => {
                    assert(result === 'OK', 'promised returned resolved value');
                    resolve();
                }).catch(error => {
                    assert(false, 'resolved promise should not go down error path');
                    console.log(error);
                    resolve();
                });
            }));
        }],

        ['resolveWithinTimeout', () => {
            // test that a bd-promise resolves correctly asynchronously, with a timer
            return new Promise((resolve => {
                const p = new BdPromise(75, (resolve => {
                    setTimeout(() => {
                        resolve('OK');
                    }, 50);
                }));
                p.then(result => {
                    assert(result === 'OK', 'promised returned resolved value');
                    resolve();
                }).catch(error => {
                    assert(false, 'resolved promise should not go down error path');
                    console.log(error);
                    resolve();
                });
            }));
        }],

        ['TimeoutBeforeResolve', () => {
            // test that a bd-promise rejects correctly asynchronously, with a timer that times out
            return new Promise((resolve => {
                const p = new BdPromise(50, (resolve => {
                    setTimeout(() => {
                        resolve('OK');
                    }, 75);
                }));
                p.then(result => {
                    assert(false, 'promise should timeout.');
                    console.log(result);
                    resolve();
                }).catch(error => {
                    assert(error === BdPromise.promiseTimeExpired);
                    resolve();
                });
            }));
        }]
    ]
});
