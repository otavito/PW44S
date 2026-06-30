package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.repository.OrderItemRepository;
import br.edu.utfpr.pb.pw44s.server.service.IOrderItemService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemServiceImpl extends CrudServiceImpl<OrderItem, Long> implements IOrderItemService {

    private final OrderItemRepository orderItemrepository;

    public OrderItemServiceImpl(OrderItemRepository orderItemrepository) {
        this.orderItemrepository = orderItemrepository;
    }

    @Override
    protected JpaRepository<OrderItem, Long> getRepository() {
        return orderItemrepository;
    }

    @Override
    public List<OrderItem> findByOrderId(Long orderId) {
        return orderItemrepository.findByOrderId(orderId);
    }
}
