package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {

    @NotEmpty(message = "A lista de itens do pedido não pode estar vazia")
    private List<OrderItemDTO> items;

    @NotNull(message = "O endereço de entrega é obrigatório")
    private Long addressId;

    @NotBlank(message = "A forma de pagamento é obrigatória")
    private String paymentMethod;

    public OrderRequestDTO() {
    }

    public OrderRequestDTO(List<OrderItemDTO> items, Long addressId, String paymentMethod) {
        this.items = items;
        this.addressId = addressId;
        this.paymentMethod = paymentMethod;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
