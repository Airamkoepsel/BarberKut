package com.barberkut.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AppointmentAccessDeniedException extends RuntimeException {

    public AppointmentAccessDeniedException() {
        super("Este agendamento não pertence ao usuário autenticado.");
    }
}
