var FortTimer = {
    started:null,
    timer:null,
    pause_date:null,
    unpause_date: null,
    logs:true,
    cookie:false,
    cookie_name:'forttimer',
    element:null,
    on_update: null,
    startit:function(reset){

        if(fechaHoraInicioActividadxCronometro){
            console.log(fechaHoraInicioObtenido.fechaHoraInicio)
            if(this.started == null){

                this.started = new Date(fechaHoraInicioObtenido.fechaHoraInicio);
            }
            if(reset){
                this.started = new Date(fechaHoraInicioObtenido.fechaHoraInicio);
            }
        }else{
            console.log('Entro Sin Tiempo')
            if(this.started == null){

                this.started = new Date(); //if its null, then we start it
            }
            if(reset){
                this.started = new Date(); //If the reset parameter is set up, then we restart the started date
            }
        }

        
        if(this.pause_date != null){
            //This means that the clock was paused. We need to calculate and move the start date.
            this.unpause_date = new Date();
            var dif = this.unpause_date.getTime() - this.pause_date.getTime();
            this.started.setTime( this.started.getTime() + dif );
            this.unpause_date = null;
            this.pause_date = null;
        }
        this.timer = setInterval(function(){
            FortTimer.update();
        },500);
    },
    start_with_value: function(v){
        this.log("Starts with time");
        this.started = new Date();
        this.log("Incomming value:" + v);
        this.started.setMilliseconds( this.started.getMilliseconds() - v );
        this.startit(false);
    },
    get_seconds:function(){
        if(this.started == null){
            return 0;
        }else{
            currentDate = new Date();
            var dif = currentDate.getTime() - this.started.getTime();
            return dif;
        }
    },
    update:function(){
        dif = this.get_seconds();
        this.log(dif);

        if(this.element != null){
            var timed = this.secondsToTime( dif / 1000 );

            time = document.getElementById("time");
            time.innerHTML = this.pad(timed.h,2) + ":" + this.pad(timed.m,2) + ":" + this.pad(timed.s,2);
        }
        this.set_cookie();
        if(this.on_update != null){
            this.on_update();
        }
    },
    pause:function(){
        clearInterval( this.timer );
        this.pause_date = new Date();
        this.unpause_date = null;
        this.timer = null;
    },
    toggle:function(){
        if(this.timer == null){
            this.startit();
            return true;
        }else{
            this.pause();
            return false;
        }
    },
    stop:function(){
        clearInterval( this.timer );
        this.timer = null;
        this.started = null;
        this.update();
        this.set_cookie();
    },
    read_cookie:function(){
        //retrieven the original cookie
        var cfound = Cookies.get(this.cookie_name);
        if(typeof cfound != 'undefined' ){
            this.start = cfound;
            return cfound;
        }else{
            return null;
        }
    },
    set_cookie:function(){
        if(this.cookie){
            if(this.started != null){
                var currentTime = new Date();
                Cookies.set(this.cookie_name, currentTime.getTime() - this.started.getTime());
            }else{
                Cookies.set(this.cookie_name, "");
            }
        }
    },
    secondsToTime: function(secs){
            secs = Math.round(secs);
            var hours = Math.floor(secs / (60 * 60));
            var divisor_for_minutes = secs % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);
            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);
            var obj = {"h": hours,"m": minutes,"s": seconds};
            return obj;
    },
    pad:function (n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },
    log:function(t){
        if(this.logs == false){
            return;
        }
        try{
          time =  new Date();
          console.log("OT[" + time + "] " + t);
        }catch(e){}
    },
};