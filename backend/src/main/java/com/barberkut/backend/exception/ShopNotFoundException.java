package com.barberkut.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ShopNotFoundException extends RuntimeException {

    public ShopNotFoundException(String shopId) {
        super("Barbearia não encontrada: " + shopId);
    }
}
