package com.barberkut.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ShopAccessDeniedException extends RuntimeException {

    public ShopAccessDeniedException() {
        super("Esta barbearia não pertence ao usuário autenticado.");
    }
}
