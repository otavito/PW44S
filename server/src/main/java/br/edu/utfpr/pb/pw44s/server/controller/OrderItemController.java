package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.service.IOrderItemService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("order-items")
public class OrderItemController extends CrudController<OrderItem, OrderItemDTO, Long> {

    private final IOrderItemService service;
    private final ModelMapper modelMapper;

    public OrderItemController(IOrderItemService service, ModelMapper modelMapper) {
        super(OrderItem.class, OrderItemDTO.class);
        this.service = service;
        this.modelMapper = modelMapper;
    }

    @Override
    protected IOrderItemService getService() {
        return this.service;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }
}
