
export const tempStorage={
    setItem:(key,value,time)=>{
        const now=new Date();
        const item={
            value:value,
            time:now.getTime()+time
        };
        localStorage.setItem(key,JSON.stringify(item));

    },
    getItem:(key)=>{
        const itemStr=localStorage.getItem(key);
        if(!itemStr)
            return null;
        const item=JSON.parse(itemStr);
        const now=new Date();
        if(now.getTime()>item.time){
            localStorage.removeItem(key);
            return null;
        }
        return item.value;

    },
    removeItem:(key)=>{
        localStorage.removeItem(key);
    }

}