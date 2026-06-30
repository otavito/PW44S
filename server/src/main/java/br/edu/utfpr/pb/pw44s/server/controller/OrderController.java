package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderRequestDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderItemService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("orders")
public class OrderController extends CrudController<Order, OrderDTO, Long> {

    private final IOrderService service;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final IProductService productService;
    private final IOrderItemService orderItemService;
    private final IAddressService addressService;

    public OrderController(IOrderService service, ModelMapper modelMapper, UserService userService, IProductService productService, IOrderItemService orderItemSerice, IAddressService addressService) {
        super(Order.class, OrderDTO.class);
        this.service = service;
        this.modelMapper = modelMapper;
        this.userService = userService;
        this.productService = productService;
        this.orderItemService = orderItemSerice;
        this.addressService = addressService;
    }

    @Override
    protected IOrderService getService() {
        return this.service;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }

    @Override
    @GetMapping
    public ResponseEntity<List<OrderDTO>> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        List<OrderDTO> orders = service.findByUserId(user.getId())
                .stream()
                .map(o -> {
                    OrderDTO dto = modelMapper.map(o, OrderDTO.class);
                    List<OrderItemDTO> items = orderItemService.findByOrderId(o.getId())
                            .stream()
                            .map(item -> {
                                OrderItemDTO itemDTO = modelMapper.map(item, OrderItemDTO.class);
                                if (item.getProduct() != null) {
                                    itemDTO.setProductName(item.getProduct().getName());
                                }
                                return itemDTO;
                            })
                            .collect(Collectors.toList());
                    dto.setItems(items);
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody @Valid OrderRequestDTO orderRequestDTO,
                                         Principal principal) {

        String username = principal.getName();
        User user = userService.findByUsername(username);

        Address deliveryAddress = addressService.findOne(orderRequestDTO.getAddressId());
        if (deliveryAddress == null || !deliveryAddress.getUser().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Endereço de entrega inválido ou não pertence ao usuário.");
        }

        Order order = new Order();
        order.setDate(LocalDateTime.now());
        order.setUser(user);
        order.setDeliveryAddress(deliveryAddress);
        order.setPaymentMethod(orderRequestDTO.getPaymentMethod());
        order = service.save(order);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemDTO itemDTO : orderRequestDTO.getItems()) {

            Product product = productService.findOne(itemDTO.getProductId());
            if (product == null) {
                return ResponseEntity.badRequest().body("Produto com ID " + itemDTO.getProductId() + " não encontrado.");
            }

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            total = total.add(itemTotal);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(itemTotal);

            orderItemService.save(item);
        }

        order.setTotal(total);
        service.save(order);

        return ResponseEntity.status(HttpStatus.CREATED).body("Pedido criado com sucesso.");
    }


}
