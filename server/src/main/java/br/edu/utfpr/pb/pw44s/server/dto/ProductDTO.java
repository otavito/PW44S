package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.Category;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ProductDTO {

    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String description;

    @NotNull
    private BigDecimal price;

    @NotNull
    private Category category;

    private String image;
    private String mini1;
    private String mini2;
    private String mini3;

    public ProductDTO() {}

    public ProductDTO(Long id, String name, String description, BigDecimal price, Category category, String image, String mini1, String mini2, String mini3) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image;
        this.mini1 = mini1;
        this.mini2 = mini2;
        this.mini3 = mini3;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getMini1() {
        return mini1;
    }

    public void setMini1(String mini1) {
        this.mini1 = mini1;
    }

    public String getMini2() {
        return mini2;
    }

    public void setMini2(String mini2) {
        this.mini2 = mini2;
    }

    public String getMini3() {
        return mini3;
    }

    public void setMini3(String mini3) {
        this.mini3 = mini3;
    }
}
