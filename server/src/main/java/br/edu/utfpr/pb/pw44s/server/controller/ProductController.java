package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("products")
public class ProductController extends CrudController<Product, ProductDTO, Long> {
    private final IProductService productService;
    private final ModelMapper modelMapper;

    public ProductController(IProductService productService, ModelMapper modelMapper) {
        super(Product.class, ProductDTO.class);
        this.productService = productService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<Product, Long> getService() {
        return this.productService;
    }

    @Override
    public ModelMapper getModelMapper() {
        return modelMapper;
    }

    @GetMapping("category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> findByCategory(@PathVariable Long categoryId) {
        List<ProductDTO> products = productService.findByCategoryId(categoryId)
                .stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> save(@RequestBody @Valid ProductDTO productDTO) {
        Product saved = productService.save(modelMapper.map(productDTO, Product.class));
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(saved, ProductDTO.class));
    }
}
