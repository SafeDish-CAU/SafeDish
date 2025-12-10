package com.safedish.backend.rdb.service;

import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.entity.Store;
import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.repository.MenuRepository;
import com.safedish.backend.rdb.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenuService {
    private final StoreRepository storeRepository;
    private final MenuRepository menuRepository;

    public Menu createMenu(String token, Long storeId, String name, Long type, Long price, Long allergyMask) throws Exception {
        Optional<Store> storeOpt = storeRepository.findById(storeId);
        if (storeOpt.isEmpty()) {
            throw new Exception("해당하는 매장이 없습니다.");
        }

        Store store = storeOpt.get();
        Owner owner = store.getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        Menu menu = new Menu(name, type, price, allergyMask, store);
        menuRepository.save(menu);

        return menu;
    }

    public Menu findByMenuId(Long id) throws Exception {
        Optional<Menu> menuOpt = menuRepository.findById(id);
        if (menuOpt.isEmpty()) {
            throw new Exception("해당하는 메뉴가 없습니다.");
        }

        return menuOpt.get();
    }
}
