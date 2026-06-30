package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.error.ApiError;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("users")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    public UserController(UserService userService,
                          ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody @Valid UserDTO user) {
        if (userService.findByUsername(user.getUsername()) != null) {
            ApiError error = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Validation error!",
                "/users",
                Map.of("username", "Usuário já cadastrado")
            );
            return ResponseEntity.badRequest().body(error);
        }

        User newUser = modelMapper.map(user, User.class);
        userService.save(newUser);
        return ResponseEntity.ok(new GenericResponse("User created"));
    }

}