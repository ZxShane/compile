int main(){
    int a;
    a = 0;
    for(a; a<10; a++){
        write(a);
    }

    printf("\n");

    while(a>0){
        write(a);
        a --;
    }

    do{
        write(a);
        a ++;
    }while(a<10);
    return 0;

}
