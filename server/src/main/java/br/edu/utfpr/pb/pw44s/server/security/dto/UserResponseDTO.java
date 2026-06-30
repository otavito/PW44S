package br.edu.utfpr.pb.pw44s.server.security.dto;

import br.edu.utfpr.pb.pw44s.server.model.User;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class UserResponseDTO {

    private String displayName;
    private String username;
    private Set<AuthorityResponseDTO> authorities;

    public UserResponseDTO(User user) {
        this.displayName = user.getDisplayName();
        this.username = user.getUsername();
        this.authorities = new HashSet<>();
        for (GrantedAuthority authority: user.getAuthorities()) {
            authorities.add( new AuthorityResponseDTO(authority.getAuthority()) );
        }
    }

    public UserResponseDTO() {
    }

    public UserResponseDTO(String displayName, String username, Set<AuthorityResponseDTO> authorities) {
        this.displayName = displayName;
        this.username = username;
        this.authorities = authorities;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<AuthorityResponseDTO> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<AuthorityResponseDTO> authorities) {
        this.authorities = authorities;
    }
}
