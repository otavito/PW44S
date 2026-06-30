package br.edu.utfpr.pb.pw44s.server.security.dto;

import lombok.*;

@Data
@Builder
public class AuthorityResponseDTO {

    private String authority;

    public AuthorityResponseDTO() {
    }

    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    public AuthorityResponseDTO(String authority) {
        this.authority = authority;
    }


}
