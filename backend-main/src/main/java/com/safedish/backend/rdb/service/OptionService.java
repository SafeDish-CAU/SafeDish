package com.safedish.backend.rdb.service;

import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.entity.OptionGroup;
import com.safedish.backend.rdb.entity.OptionItem;
import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.repository.MenuRepository;
import com.safedish.backend.rdb.repository.OptionGroupRepository;
import com.safedish.backend.rdb.repository.OptionItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OptionService {
    private final MenuRepository menuRepository;
    private final OptionGroupRepository optionGroupRepository;
    private final OptionItemRepository optionItemRepository;

    public OptionGroup createOptionGroup(String token, Long menuId, String name) throws Exception {
        Optional<Menu> menuOpt = menuRepository.findById(menuId);
        if (menuOpt.isEmpty()) {
            throw new Exception("해당하는 메뉴가 없습니다.");
        }

        Menu menu = menuOpt.get();
        Owner owner = menu.getStore().getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        OptionGroup group = new OptionGroup(name, 0L, 1L, menu);
        optionGroupRepository.save(group);

        return group;
    }

    public OptionItem createOptionItem(String token, Long groupId, String name, Long price, Long allergyMask) throws Exception {
        Optional<OptionGroup> groupOpt = optionGroupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            throw new Exception("해당하는 옵션 그룹이 없습니다.");
        }

        OptionGroup group = groupOpt.get();
        Owner owner = group.getMenu().getStore().getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        OptionItem item = new OptionItem(name, price, allergyMask, group);
        optionItemRepository.save(item);

        return item;
    }

    public void deleteOptionGroup(String token, Long groupId) throws Exception {
        Optional<OptionGroup> groupOpt = optionGroupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            throw new Exception("해당하는 옵션 그룹이 없습니다.");
        }

        OptionGroup group = groupOpt.get();
        Owner owner = group.getMenu().getStore().getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        optionGroupRepository.delete(group);
    }
    
    public void deleteOptionItem(String token, Long groupId, Long itemId) throws Exception {
        Optional<OptionItem> itemOpt = optionItemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new Exception("해당하는 옵션 아이템이 없습니다.");
        }

        OptionItem item = itemOpt.get();
        OptionGroup group = item.getGroup();
        if (!Objects.equals(group.getId(), groupId)) {
            throw new Exception("그룹과 매칭되지 않습니다.");
        }

        Owner owner = group.getMenu().getStore().getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        optionItemRepository.delete(item);
    }

    public OptionGroup editOptionGroup(String token, Long groupId, String name, Long minSeletced, Long maxSelected) throws Exception {
        Optional<OptionGroup> groupOpt = optionGroupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            throw new Exception("해당하는 옵션 그룹이 없습니다.");
        }

        OptionGroup group = groupOpt.get();
        Owner owner = group.getMenu().getStore().getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        group.setName(name);
        group.setMinSelected(minSeletced);
        group.setMaxSelected(maxSelected);
        optionGroupRepository.save(group);
        return group;
    }

    public OptionItem editOptionItem(String token, Long groupId, Long itemId, String name, Long price, Long allergyMask) throws Exception {
        Optional<OptionItem> itemOpt = optionItemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new Exception("해당하는 옵션 아이템이 없습니다.");
        }

        OptionItem item = itemOpt.get();
        OptionGroup group = item.getGroup();
        if (!Objects.equals(group.getId(), groupId)) {
            throw new Exception("그룹과 매칭되지 않습니다.");
        }

        Owner owner = group.getMenu().getStore().getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        item.setName(name);
        item.setPrice(price);
        item.setAllergyMask(allergyMask);
        optionItemRepository.save(item);
        return item;
    }
}
