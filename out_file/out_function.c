void swap(int *a, int *b){
	int temp = *a;
	*a = *b;
	*b = temp;
}

int main(){
    int a = 1;
    int b = 2;
    swap(&a, &b);
    printf("a=");
    write(a);
    printf("\nb=");
    write(b);
    printf("\n");
    return 0;
}
