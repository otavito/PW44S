package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("addresses")
public class AddressController extends CrudController<Address, AddressDTO, Long> {

    private final IAddressService service;
    private final ModelMapper modelMapper;
    private final UserService userService;

    public AddressController(IAddressService service, ModelMapper modelMapper, UserService userService) {
        super(Address.class, AddressDTO.class);
        this.service = service;
        this.modelMapper = modelMapper;
        this.userService = userService;
    }

    @Override
    protected IAddressService getService() {
        return this.service;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }

    @Override
    @GetMapping
    public ResponseEntity<List<AddressDTO>> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        List<AddressDTO> addresses = service.findByUserId(user.getId())
                .stream()
                .map(a -> modelMapper.map(a, AddressDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(addresses);
    }

    @PostMapping
    public GenericResponse create(Principal principal, @RequestBody @Valid AddressDTO addressDTO) {
        String username = principal.getName();
        User user = userService.findByUsername(username);
        Address address = modelMapper.map(addressDTO, Address.class);
        address.setUser(user);
        service.save(address);
        return new GenericResponse("Endereço salvo com sucesso para o usuário autenticado.");
    }

    @Override
    @PutMapping("{id}")
    public ResponseEntity<AddressDTO> update(@PathVariable Long id, @RequestBody @Valid AddressDTO addressDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        Address address = modelMapper.map(addressDTO, Address.class);
        address.setId(id);
        address.setUser(user);
        Address saved = service.save(address);
        return ResponseEntity.ok(modelMapper.map(saved, AddressDTO.class));
    }

}
