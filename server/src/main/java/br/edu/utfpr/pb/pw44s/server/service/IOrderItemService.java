package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.OrderItem;

import java.util.List;

public interface IOrderItemService extends ICrudService<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
}
