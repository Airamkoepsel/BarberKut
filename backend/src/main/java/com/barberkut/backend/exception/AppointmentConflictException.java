package com.barberkut.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Lançada quando já existe um agendamento ativo para o mesmo barbeiro,
 * barbearia, data e horário. Mapeada direto pra HTTP 409, pra já sair pronta
 * pra quando os endpoints (P1.6) existirem.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class AppointmentConflictException extends RuntimeException {

    public AppointmentConflictException(String message) {
        super(message);
    }
}
