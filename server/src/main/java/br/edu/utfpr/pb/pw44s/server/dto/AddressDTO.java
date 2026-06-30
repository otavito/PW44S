package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class AddressDTO {

    private Long id;

    private Long userId;

    @NotBlank
    @Size(min = 5, max = 100)
    private String address;

    @Size(max = 100)
    private String complement;

    @NotBlank
    private String cep;

    public AddressDTO() {
    }

    public AddressDTO(Long id, Long userId, String address, String complement, String cep) {
        this.id = id;
        this.userId = userId;
        this.address = address;
        this.complement = complement;
        this.cep = cep;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getComplement() {
        return complement;
    }

    public void setComplement(String complement) {
        this.complement = complement;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }
}
