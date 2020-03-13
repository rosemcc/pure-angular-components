import { Subject, Observer, Observable } from "rxjs";
import { zip } from 'rxjs/operators';

export class Lock {
    private lockAcquire = new Subject<Observer<void>>();
    private lockRelease = new Subject();
  
    constructor() {
      this.lockAcquire.pipe(zip(this.lockRelease))
        .subscribe(([acquirer, released])=> {
          acquirer.next();
          acquirer.complete();
        });
      this.release();
    }
  
    public acquire(): Observable<void> {
      return Observable.create((observer: Observer<void>) => {
        this.lockAcquire.next(observer);
      });
    }
  
    public release() {
      this.lockRelease.next();
    }
}