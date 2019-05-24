	.file	"main.c"
	.intel_syntax noprefix
	.section .rdata,"dr"
_L9:
	.ascii "%d\0"
	.align 4
	.def	___main;	.scl	2;	.type	32;	.endef
	.text
	.globl _main
	.def	_main;	.scl	2;	.type	32;	.endef
_main:
	push ebp
	mov ebp,esp
	and esp, -16
	sub esp,44
	call	___main
	mov eax,0
	mov DWORD PTR[ebp-4],eax
	mov eax,0
	mov DWORD PTR[ebp-8],eax
L2:
	mov eax,DWORD PTR [ebp-4]
	mov ebx,100
	mov ecx,0
	cmp eax,ebx
	setle cl
	mov DWORD PTR[ebp-12],ecx
	mov eax,DWORD PTR [ebp-12]
	cmp eax,0
	je L3
	jmp L5
L6:
	mov eax,0
	mov DWORD PTR[ebp-16],eax
	mov eax,DWORD PTR [ebp-4]
	mov DWORD PTR[ebp-16],eax
	mov eax,DWORD PTR [ebp-4]
	mov ebx,1
	add eax,ebx
	mov DWORD PTR[ebp-4],eax
	jmp L2
L5:
	mov eax,DWORD PTR [ebp-8]
	mov ebx,DWORD PTR [ebp-4]
	add eax,ebx
	mov DWORD PTR[ebp-20],eax
	mov eax,DWORD PTR [ebp-20]
	mov DWORD PTR[ebp-8],eax
	jmp L6
L3:
	mov eax,DWORD PTR [ebp-8]
	mov	DWORD PTR [esp+4], eax
	mov	DWORD PTR [esp], OFFSET FLAT:_L9

	call  _printf
L1:
	mov esp,ebp
	pop ebp
	ret
	.ident	"GCC: (GNU) 6.4.0"
	.def	_printf;	.scl	2;	.type	32;	.endef
